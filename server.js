const express = require('express');
const http = require('http');
const sio = require('socket.io');

const fs = require('fs');
const ws = require('ws');
const path = require('path');
const enableWs = require('express-ws');

const app = express();
const server = http.createServer(app);
//const wss = new ws.Server({server});
const io = sio(server);

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

/*
app.get('/ws', ( req, res ) => {
        wss.handleUpgrade(req,req.socket,Buffer.alloc(0), (socket) => {
            console.log('connection ');
            clients.add(socket);
            let player = {
                playerId:playersCount
            };
            socket.send(JSON.stringify(player)); 
            playersCount++;

            socket.on('message' , function(message) {
            for(let clinet of clients) {
                clinet.send(message);
            }
        });
    } );          
});
*/

server.listen(80,() => console.log('Server started on port 80') );
