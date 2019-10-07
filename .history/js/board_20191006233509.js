/*
  some utility funnctions 
*/
$ = {};

if($.redirect==undefined)
$.redirect = (url) => {
    document.location = url;
}

if($.toggleClass==undefined)
$.toggleClass = (el , className) => {
  el.classList.toggle(className);
};
if($.select==undefined)
$.select = (selector) => {
  return document.querySelector(selector);
};
if($.selectAll==undefined)
$.selectAll = (selector) => {
  return document.querySelectorAll(selector);
};

if($.clone==undefined)
$.clone = (aObject) => {
  if (!aObject)
    return aObject;
  
  let v;
  let bObject = Array.isArray(aObject) ? [] : {};
  for (const k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === "object") ? $.clone(v) : v;
  }

  return bObject;
}

/****************/

var board = {} ;
var boardRef ;
var piecesRefs = [];
var piecesSets = [
  //set1
  {
    //side1
    '0' : '' , '1':'pawn1' , '2' : 'rook1' , '3' : 'knight1' , '4' : 'bishop1' , '5' : 'king1' , '6' : 'queen1',
    //side2
    '-1':'pawn2' , '-2' : 'rook2' , '-3' : 'knight2' , '-4' : 'bishop2' , '-5' : 'king2' , '-6' : 'queen2'
  }
];
var iconsSet = piecesSets[0];

var boardPos = gameDetails.board;
/* [
  [2,3,4,5,6,4,3,2] ,
  [1,1,1,1,1,1,1,1] ,
  [0,0,0,0,0,0,0,0] ,
  [0,0,0,0,0,0,0,0] ,
  [0,0,0,0,0,0,0,0] ,
  [0,0,0,0,0,0,0,0] ,
  [-1,-1,-1,-1,-1,-1,-1,-1] ,
  [-2,-3,-4,-6,-5,-4,-3,-2] 
]; */

var activePiece ;
var playerSide = 1 ;
var playerTurn ;

function setBoard() {

  if(gameDetails.firstPlayer==username)
    playerSide = -1;
  $.select('#opponent #name').innerHTML = gameDetails.firstPlayer;
  $.select('#im #name').innerHTML = gameDetails.secondPlayer;

  boardRef = document.querySelector('#board');
  var boardHtml = "";
  for(var i=0;i<8;i++)
    for(var j=0;j<8;j++) {
    var block = i % 2 == 0 ? ( j%2 == 0 ? 'block1' : 'block2') : ( j%2 == 0 ? 'block2' : 'block1' )  ;
    boardHtml+='<div onClick="handleBlockClick(this)" class="block '+block+'" id="b'+i+'_'+j+'" row="'+i+'" col="'+j+'" ><div class="piece" row="'+i+'" col="'+j+'" id="b'+i+'_'+j+'"></div></div>';
  }
  boardRef.innerHTML = boardHtml;
  piecesRefs = document.querySelectorAll('.board .piece');
}

function updateBoard( piecesRefs , piecesPos) {
  console.log('updating .. '+piecesRefs+' '+piecesPos );
  for(var i=0;i<piecesRefs.length;i++) {
    var piece = piecesRefs[i];
    var row = piece.getAttribute('row');
    var col = piece.getAttribute('col');
    var cls = iconsSet[piecesPos[row][col]];
    piecesRefs[i].setAttribute('class', 'piece ' + cls );
  } 
}

function handleBlockClick(block){
  handlePieceClick(block.childNodes[0]);
}

function handlePieceClick(piece) {

  var row = piece.getAttribute('row');
  var col = piece.getAttribute('col');
  var val = boardPos[row][col];
  var pieceObj = {
    element : piece ,
    row : row ,
    col : col ,
    pieceVal : val
  };

  var action = identifyAction(pieceObj);
  console.log('action ' + action);

  if(action==actions.ACTIVATE_AND_SHOW_MOVES)
    activateAndShowValidMoves(pieceObj);
  else if(action==actions.PLAY_MOVE)
    playMove(pieceObj);
  
}

function playMove(piece) {
  if(activePiece!=undefined && isValidPosibleMove(piece) ) {
    $.toggleClass(activePiece.element , 'active');
    movePiece(activePiece , piece);
    clearPossibleMoves();
    activePiece = undefined;
  }
}

function isValidPosibleMove(piece) {
  var row = piece.row;
  var col = piece.col;
  for(var i=0;i<activePossibleMoves.length;i++)
    if(activePossibleMoves[i][0] == row && activePossibleMoves[i][1] == col )
      return true;
  return false;

}

function movePiece(from , to) {
  var fromCls = iconsSet[boardPos[from.row][from.col]];
  var toCls = iconsSet[boardPos[to.row][to.col]];
  if(fromCls != '' ) {
    $.toggleClass(from.element,fromCls);
  }
  if(toCls != '') {
    $.toggleClass(to.element,toCls);
  }

  if(fromCls != '') {
    $.toggleClass(to.element , fromCls);
    if(boardPos[to.row][to.col] !=0 )
      updateOutDashBoard(to,playerSide);
    var beforeBoard = $.clone(boardPos);
    boardPos[to.row][to.col] = boardPos[from.row][from.col];
    boardPos[from.row][from.col] = 0;
    moveHistory.updateHistory(playerSide,from,to,beforeBoard) ;
    //togglePlayer();
  }

  //check for winner 

}


var movesHistory = [];
var moveHistory = {
  updateHistory : (player , from , to , boardBefore , boardAfter) => {
    console.log('boardBefore :'+boardBefore);
    var move = {
      player : player ,
      from : from ,
      to : to ,
      boardBefore :  boardBefore ,
      boardAfter : boardAfter
    }
    movesHistory.push(move);
  } ,
  undo : () => {
    var move = movesHistory.pop();
    updateBoard(piecesRefs,move.boardBefore);
    boardPos = Array.from( move.boardBefore) ;
  }
};

function activateAndShowValidMoves(piece) {
  if( activePiece != undefined )
    $.toggleClass(activePiece.element,'active');
  activePiece = piece;
  $.toggleClass(piece.element,'active');

  showPossibleMoves(piece);
}

function int(val) {
  return parseInt(val);
}

var moves = {
  possibleMoves : {
    '0':[] ,
    '1': (boardPoss , piece,row,col) => {
        return moves.filters.boundaryFilter( moves.filters.pawnFilter( [ [ [row+1,col] , [row+2,col] ] , [ [row+1,col-1] , [row+1,col+1] ] ] , piece ) );
    },
    '2': (boardPoss , piece,row,col) => {
        return moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row+1,col],[8,8] , [1,0])))
        .concat( moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row,col+1],[8,8] , [0,1]))))
        .concat( moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row,col-1],[-1,-1] , [0,-1]))))
        .concat( moves.filters.obstacleFilter(moves.filters.boundaryFilter(moves.crossRange([row-1,col],[-1,-1] , [-1,0]))) ) ;
    } ,
    '3': (boardPoss , piece,row,col) => {
      return moves.filters.selfFilter( moves.filters.boundaryFilter( [ [row+2,col+1] , [row-2,col+1] ,[row+2,col-1] , [row-2,col-1] , [row+1,col+2] , [row+1,col-2] ,[row-1,col+2] , [row-1,col-2] ] ));
     } , 
    '4': (boardPoss , piece,row,col) => {
      return moves.filters.obstacleFilter( moves.filters.boundaryFilter( moves.crossRange([row+1,col+1],[8,8],[1,1])))
      .concat( moves.filters.obstacleFilter( moves.filters.boundaryFilter(moves.crossRange([row+1,col-1],[8,-8],[1,-1]))))
      .concat( moves.filters.obstacleFilter( moves.filters.boundaryFilter(moves.crossRange([row-1,col+1],[-8,8],[-1,1]))))
      .concat( moves.filters.obstacleFilter( moves.filters.boundaryFilter(moves.crossRange([row-1,col-1],[-8,-8],[-1,-1])))) ;
    } ,
     '5': (boardPoss , piece,row,col) => {
      return moves.filters.selfFilter( moves.filters.boundaryFilter( [ [row+1,col] , [row+1,col+1] , [row,col+1] , [row-1,col+1] ,[row-1,col] , [row-1,col-1],[row,col-1] , [row+1,col-1] ] )) ;
     } ,
    '6': (boardPoss , piece,row,col) => { 
      return moves.possibleMoves['2'](boardPoss , piece,row,col).concat(moves.possibleMoves['4'](boardPoss , piece,row,col));
    },  
    '-1' : (boardPoss , piece,row,col) => {
      return moves.filters.boundaryFilter( moves.filters.pawnFilter( [ [ [row-1,col] , [row-2,col] ] , [ [row-1,col-1] , [row-1,col+1] ] ] , piece ) );
    } ,
    '-2' : (boardPoss , piece,row,col) => {
      return moves.possibleMoves['2'](boardPoss , piece,row,col);
    } ,
    '-3' : (boardPoss , piece,row,col) => {
      return moves.possibleMoves['3'](boardPoss , piece,row,col);
    } ,
    '-4' : (boardPoss , piece,row,col) => {
      return moves.possibleMoves['4'](boardPoss , piece,row,col);
    } ,
    '-5' : (boardPoss , piece,row,col) => {
      return moves.possibleMoves['5'](boardPoss , piece,row,col);
    } ,
    '-6' : (boardPoss , piece,row,col) => {
      return moves.possibleMoves['6'](boardPoss , piece,row,col);
    }
  } ,
};

moves.range = (start,end,step=1) => {
  var range = [];
  for(var i=start;i<end;i=i+step)
    range.push(i);
  return range;
};
moves.crossRange = (start,end,step) => {
  
    var iter = 0;
    var range = [] ;

    for(var i=start[0],j=start[1];  
      (step[0]==0 ? true : step[0] > 0 ? i<end[0] : i > end[0]) && ( step[1]==0 ? true : step[1]>=0 ? j<end[1] : j>end[1]) ; 
      i+=step[0],j+=step[1] ) {
        range.push([i,j]);
        if(iter++>100)
         break;
      }
      return range;

};
moves.filters = {
  boundaryFilter : (unfiltered) => {
    var filtered = [];
    for(var i=0;i<unfiltered.length;i++)
      if( unfiltered[i][0]>=0 && unfiltered[i][1]>=0 && unfiltered[i][0]<8 && unfiltered[i][1]<8 )
        filtered.push(unfiltered[i]);
    return filtered;
  } ,
  obstacleFilter : (unfiltered,flag) => {
    if(unfiltered==undefined)
      return [];

    var filtered = [];
    for(var i=0;i<unfiltered.length;i++) {
      if( boardPos[ unfiltered[i][0] ][unfiltered[i][1] ] == 0 )
        filtered.push(unfiltered[i]);
      else {
        if(flag == undefined && boardPos[ unfiltered[i][0] ][unfiltered[i][1] ] * playerSide <= 0 )
          filtered.push(unfiltered[i]);
          break;
      }
    }
    return filtered;
  } ,
  selfFilter : (unfiltered) => {
    var filtered = [];
    for(var i=0;i<unfiltered.length;i++)
        if(boardPos[ unfiltered[i][0] ][unfiltered[i][1] ] * playerSide <= 0 )
          filtered.push(unfiltered[i]);
    
    return filtered;
  }  ,
  pawnFilter : (unfiltered,piece) => {
    var filtered = [];
    console.log(unfiltered+'\n'+piece.row);
    unfiltered[0] = moves.filters.obstacleFilter(unfiltered[0],true);
    if(unfiltered[0]!=undefined && unfiltered[0].length>0)
    if( playerSide>0 ? piece.row == 1 : piece.row==6 )
      filtered = filtered.concat(unfiltered[0]);
    else
      filtered.push(unfiltered[0][0]);

      console.log(filtered);

    for(var i=0;i<unfiltered[1].length;i++)
        if(boardPos[ unfiltered[1][i][0] ][unfiltered[1][i][1] ] * playerSide < 0 )
          filtered.push(unfiltered[1][i]);

    return filtered;
  } ,
};

var activePossibleMoves;

function showPossibleMoves(piece) {
  
  clearPossibleMoves();

  var val = boardPos[piece.row][piece.col];
  console.log('val'+val);
  var posblMoves = moves.possibleMoves[val](boardPos,piece,int(piece.row),int(piece.col));
  console.log(posblMoves);

  for(var i=0;i<posblMoves.length;i++) {
    var row = posblMoves[i][0];
    var col = posblMoves[i][1];
    console.log(' style '+'.piece[row="'+row+'"][col="'+col+'"]');
    $.toggleClass($.select('.piece[row="'+row+'"][col="'+col+'"]') , 'active-posib');
  }
  activePossibleMoves = posblMoves;
}
function clearPossibleMoves() {
  if(activePossibleMoves != undefined )
    for(var i=0;i<activePossibleMoves.length;i++) {
      var row = activePossibleMoves[i][0];
      var col = activePossibleMoves[i][1];
      $.toggleClass($.select('.piece[row="'+row+'"][col="'+col+'"]') , 'active-posib');
    }
  activePossibleMoves = undefined;
}

var actions = {
  INVALID : 0,
  ACTIVATE : 1 ,
  SHOW_MOVES : 2,
  ACTIVATE_AND_SHOW_MOVES : 3,
  PLAY_MOVE : 4 ,
};
function identifyAction(piece) {
  var val = boardPos[piece.row][piece.col];
  console.log('val'+val);
  if(val*playerSide <= 0 && activePiece==undefined )
    return actions.INVALID
  else
  if( activePiece==undefined && val*playerSide > 0 )
    return actions.ACTIVATE_AND_SHOW_MOVES;
  else 
    if( boardPos[activePiece.row][activePiece.col]*val > 0 ) 
      return actions.ACTIVATE_AND_SHOW_MOVES;
    else 
      return actions.PLAY_MOVE;
   
}

function updateOutDashBoard(piece,playerSide) {
  $.select('.out-list[playerSide="'+playerSide+'"]').innerHTML+='<div class="out-item '+iconsSet[boardPos[piece.row][piece.col]]+'"></div>';
}
function togglePlayer() {
  playerSide = -1 * playerSide;
}

setBoard();
updateBoard(piecesRefs,boardPos);


//controls handlers
var controls = { 
  undo : () => {
    moveHistory.undo();
  } ,
  pause() {
    Swal.fire({
      title: 'Game Paused',
      text: "",
      type: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Resume the Game',
      allowOutsideClick:false,
    });
  } ,
  giveUp() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't to Give Up the game ...",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exit'
    }).then((result) => {
      if (result.value) {
        window.close();
      }
    });
  } ,
  exit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't to exit the game ...",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exit'
    }).then((result) => {
      if (result.value) {
        window.close();
      }
    });
  }
}

/* 
Creating and Initilizing websocket and utility functions  
  */
let url = 'http://localhost:8080';
//let url = "https://onlchess.herokuapp.com";

var instance ;
var socket = io.connect(url  , { query : 'username='+username+'&gameId='+gameDetails.id });

// handle incoming messages
socket.on('instance', function (data) {
    console.log('instance:'+JSON.stringify(data));
    instance = data.instance;
  });  
socket.on('event', function (event) {
    console.log('incoming:'+JSON.stringify(event));
    //handle_Block_Click(event.event.blockId);
  });
  
  function fire(event) {
      let data = {
          instance:instance , 
          event : event     
      };
      console.log('emitting '+JSON.stringify(data));
      socket.emit('event', data);
  }
