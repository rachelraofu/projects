import React, { useState, useEffect } from "react";
import VideoDetail from '../VideoDetail/VideoDetail';
import VideoList from '../VideoList/VideoList';
import SearchBar from '../SearchBar/SearchBar';
import { Grid } from "@material-ui/core";
import server from "../api/server";
import Chat from '../Chat/Chat';

export default ({ location }) => {
  const [vids, setVids] = useState([{
            vid:'g9GFiCOOZn0',
            title:'You Should Come to Georgia Tech',
            len:161000,
            end:new Date().getTime() + 161000,
            fig:'https://i.ytimg.com/vi/qhUZh0A8pwk/mqdefault.jpg'
          }]);

async function loadPage(){
    fetch(
          `http://localhost:5000`,
          {
            method: "GET"
          }
        )
          .then(res => res.json())
          .then(response => {
            console.log(response);
            if(response.vids.length!=0){
              setVids(response.vids);
            }else{
              setVids([{
                        vid:'g9GFiCOOZn0',
                        title:'You Should Come to Georgia Tech',
                        len:161000,
                        end:new Date().getTime() + 161000,
                        fig:'https://i.ytimg.com/vi/qhUZh0A8pwk/mqdefault.jpg'
                      }]);
            }
          })
          .catch(error => console.log(error));
  }

  useEffect(()=>{
    loadPage();
  }, []);

  useEffect(()=>{
    setTimeout(loadPage, parseInt(vids[0].end)-new Date().getTime());
  }, [vids]);

  return (
    <Grid style={{ justifyContent: "center" }} container spacing={10}>
  <Grid item xs={11}>
    <Grid container spacing={3}>
      <Grid item xs={8}>
          <Grid item xs={12}>
            <SearchBar onSubmit={handleSubmit} />
          </Grid>
          <Grid item xs={12}>
            <VideoDetail vids={vids}/>
          </Grid>
        </Grid>

      <Grid item xs={4}>
        <Grid item xs={12}>
          <Chat location = { location } />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <VideoList videos={vids.slice(1,6)} />
    </Grid>

  </Grid>
</Grid>
  );

  function handleSubmit(searchTerm) {
    fetch(
          `http://localhost:5000`,
          {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vid: searchTerm })
          }
        )
          .then(res => res.json())
          .then(response => {
            alert(response);
          })
          .catch(error => console.log(error));
  }
}
