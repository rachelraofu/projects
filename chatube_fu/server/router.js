var redisConfig = {
      host: 'localhost',
      port: 16379
    };
const express = require("express");
const router = express.Router();
var redis = require('redis');
const rd =  redis.createClient(redisConfig);
const youtube = require("./api/youtube");
const moment = require('moment');
const _ = require('lodash');

router.get("/", (req, res) => {
  //get head
  rd.zrange('vidPQ', 0, 10,'withscores', (err, range)=>{
    response = {
      vids:[]
    };
    //[ [vid, endTime], [], ..]
    headVids = _.chunk(range,2);

    //remove outdated vids
    var count = 0;
    while(count<headVids.length && headVids[count][1] <= new Date().getTime()){
      count++;
    }
    const vids = headVids.slice(count);
    console.log(headVids,count, vids);
    rd.zpopmin('vidPQ', count, (err, ress)=>{
      for(var j=0; j<count; ++j){
        (function(j){
          rd.hdel(headVids[j][0], 'vid','title', 'fig','end', 'len');
        })(j);
      }
    });

    if(vids.length==0){
      res.send(response);
    }else{
      for(var i=0; i<vids.length; ++i){
        (function(i){
          rd.hgetall(vids[i][0],(e,r)=>{
            response.vids.push(r);
            if(i===vids.length-1){
              res.send(response);
            }
          });
        })(i);
      }
    }
  });

  //rd.hgetall("LsTgggLHYAs", (er, re)=>{console.log(re);res.send(re);});
});

router.post("/", (req, res) => {
  youtube.get("videos", {
      params: {
        part: "snippet,contentDetails",
        key: 'AIzaSyD2XuWgGwhNduP3d2a4cRqrC4yIeCOF-N0',
        id: req.body.vid
      }
    }).then(
      response => {
        const data = response.data.items[0];
        var video = {
          id : data.id,
          title : data.snippet.title,
          fig : data.snippet.thumbnails.medium.url,
          len : moment.duration(data.contentDetails.duration, moment.ISO_8601).asMilliseconds(),
          end : 0
        };
        rd.hget(video.id, 'vid', (err, obj) =>{
          //if video does not exist, insert into pq and map
          if(!obj){
            //vidPQ sorted set, key vid, score endTime
            rd.zrange('vidPQ', -1, -1, 'withscores',(err, range)=>{
              if(range.length==0){
                //empty PQ
                video.end = (new Date()).getTime() + video.len;
              }else{
                // non empty PQ
                const lastTime = parseInt(range[1]);
                video.end = lastTime + video.len;
              }
              console.log(video);
              rd.zadd('vidPQ', video.end, video.id);
              rd.hmset(video.id, 'title', video.title, 'vid', video.id, 'fig', video.fig, 'end', video.end, 'len', video.len);
            });
          }
        });
        res.send('ok').status(200);
      }
    );
});

module.exports = router;
