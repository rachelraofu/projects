var redisConfig = {
      host: 'localhost',
      port: 16379
    };

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var sticky = require('sticky-session');
var cluster = require('cluster');
var redisIO = require('socket.io-redis');
var cors = require('cors');
var redis = require('redis');
const bodyParser = require('body-parser');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(router);
const server = http.createServer(app);

const rd =  redis.createClient(redisConfig);
rd.flushdb();


var port = process.argv[2] ? process.argv[2]:5000;
if (!sticky.listen(server, port)) {
  console.log('port:'+port);
  // Master code
  server.once('listening', function() {
    console.log('Masterserver started on '+port+' port');
  });
} else {
  console.log('Child server '+ cluster.worker.id +' started');
  const io = socketio(server);
  io.adapter(redisIO(redisConfig));
  io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if(error) return callback(error);

      socket.join(user.room);

      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
      console.log('msg sent from worker '+ cluster.worker.id);
      io.to(user.room).emit('message', { user: user.name, text: message });

      callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    });
  });
}
