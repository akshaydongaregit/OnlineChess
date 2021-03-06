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
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',path.join(__dirname+'/view'));

var port = process.env.PORT || 8080;

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));
app.use(session({secret:'onlchess@123'}));
app.use(bodyParser.json());

app.use('/',(req,res,next)=> {
  let url = req.url.toString();
  if(url=='/favicon.ico')
    res.sendFile(path.join(__dirname+'/favicon.ico'));
  else if(url.includes('login') || url.includes('.js') || url.includes('.css') || url.includes('.ttf') )
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

let activeUsers = new Map();

app.post('/login' , (req,res) => {
  let username = req.body.username;
  console.log(username+' '+activeUsers.has(username));
  if(!activeUsers.has(username))
    activeUsers.set(username,{
      username:username ,
      games:[] ,
      invites : []      
    });
  
  console.log(activeUsers.keys());

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


app.post('/check-invite', (req , res ) => {
  let username = req.session.username;
  console.log('checking invite for : '+username);
  res.send(activeUsers.get(username));
});

let games = new Map();
let gamesCount = 0;
let game = {};
game.NEW = 1;
game.STARTED = 2;
game.COMPLETED = 3;

app.get('/req-new' , (req,res) => {
  let username = req.session.username;

  let gameDetails = {
    id : gamesCount,
    firstPlayer : username ,
    secondPlayer : '' ,
    status : game.NEW
  };

  games.set(gamesCount , gameDetails);
  gamesCount++;
  if(activeUsers.has(username)) {
    let activeUser = activeUsers.get(username);
    activeUser.games.push(gameDetails);
    activeUsers.set(username,activeUser);
  }
  console.log('activeUsers : '+activeUsers.get(username).games);

  res.sendFile(path.join(__dirname+'/view/start-game.html'));
});
let invite = {};
invite.INVITED = 1;
invite.ACCEPTED = 2;
invite.VERIFIED = 3;
invite.REJECTED = 4;

invite.search = ( invitesList , user ) => {
  for( let invt of invitesList )
    if( invt.from == user)
      return invt;
};
invite.wait = ( invt , status , callBack , res) => {
  setTimeout(() => {
    console.log(invt.status);
   if(invt.status == status) {
     console.log('giving callback to '+callBack);
      callBack(res , invt );
      return ;
   }
   else
    invite.wait(invt,status,callBack,res);
  }, 2000);
};

app.post('/invite', ( req , res ) => {
  let username = req.session.username;
  let gameId = activeUsers.get(username).games[0].id;
  let body = req.body;
  console.log('invite body : ' + body.to);
  //update invite for user and wait for accepting
  let toUser = activeUsers.get(body.to);
  let inviteDetails = {
    from : username ,
    to : body.to ,
    gameId : body.gameId ,
    status : invite.INVITED
  };
  toUser.invites.push(inviteDetails);
  activeUsers.set(body.to,toUser);
  //monitor status
  invite.wait(inviteDetails,invite.ACCEPTED , (res , invt) => {
    console.log('He accepted.'+invt.gameId);
    invt.status = invite.VERIFIED;
    //update game 
    let gameDetails = games.get(invt.gameId);
    gameDetails.secondPlayer = invt.to;
    gameDetails.status = game.STARTED;
    console.log('gameId:'+body.gameId);
    games.set(body.gameId , gameDetails);
    res.send({status : 'accepted' , invite : invt , game : gameDetails });
  } , res );
  
});

app.post('/accept-invite', ( req , res ) => {
  let username = req.session.username;
  let body = req.body;
  console.log('invite body : ' + JSON.stringify(body));
  //update status of invite and wait for verify
  let user = activeUsers.get(username);
  let invt = invite.search(user.invites , body.from);
  invt.status = invite.ACCEPTED;
  //wait for verification 
  invite.wait(invt,invite.VERIFIED, (res , inviteDetails ) => {    
    console.log('He verified.');
    res.send({status : 'verified' , invite : inviteDetails , game : games.get(body.gameId) });
  } , res );
});

app.get('/start', ( req , res ) => {
    let gameId = req.query.gameId ;
    console.log('id :'+gameId);
    let gameDetails = games.get(gameId);
    res.render('board',gameDetails);
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
