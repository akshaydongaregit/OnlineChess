const express = require('express');
const http = require('http');
const sio = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = sio(server);

var port = process.env.PORT || 8080;

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));

app.get('/', ( req , res ) => {
    res.sendFile(path.join(__dirname+'/view/Chess.html'));
});

const clients = new Set();
let playersCount = 0;

io.on('connection', function (socket) {
    socket.emit('identi', { playerId: playersCount });
    playersCount++;
    socket.on('event', function (event) {
      io.emit('event' , event );
    });
  });

server.listen(port,() => console.log('Server started on port '+port) );
