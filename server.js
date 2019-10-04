const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const sio = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = sio(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var port = process.env.PORT || 8080;

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));
app.use(session({secret:'onlchess@123'}));
app.use(bodyParser.json());

app.use('/',(req,res,next)=> {
  let url = req.url.toString();
  if(url.includes('login') || url.includes('js') || url.includes('css') )
    next();
  else if(req.session.username && req.session.username!=undefined){
    console.log('req '+req.session.username);
    next();
  }else{
    console.log(req.url); 
    res.redirect('/login');
  }
});

app.get('/login' , (req,res) => {
  res.sendFile(path.join(__dirname+'/view/login.html'));
});

let loginUsers = [];
let usersId = 0 ;
app.post('/login' , (req,res) => {
  let username = req.body.username;
  console.log(username);
  loginUsers.push([usersId++ , username ]);
  req.session.username = username;
  res.send({result:'success'});
});

app.get('/logout' , (req,res) => {
  req.session.username = undefined;
  res.redirect('/login');
});

app.get('/home',(req,res) => {
  res.sendFile(path.join(__dirname+'/view/home.html'));
});

app.get('/start', ( req , res ) => {
    res.sendFile(path.join(__dirname+'/view/board.html'));
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
