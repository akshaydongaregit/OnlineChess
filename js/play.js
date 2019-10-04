//initilizing blocks.
var blocks=[[2,5,8,10,12,8,5,2],[1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
            [-1,-1,-1,-1,-1,-1,-1,-1],[-2,-5,-8,-10,-12,-8,-5,-2]];

var green_marked=[];
var clicked=null;
var cplayer=1;
/*---testing---*/
//alert(""+blocks[3][3]);
/*-----------------------*/

/* ----------------------------------------------------------------- */
/*   Creating and Initilizing websocket                             */
let url = 'http://localhost:8080';
//let url = "https://onlchess.herokuapp.com";

let playerId;
var socket = io.connect(url);

// handle incoming messages
socket.on('identi', function (data) {
    console.log('identi:'+JSON.stringify(data));
    playerId = data.playerId;
  });  
socket.on('event', function (event) {
    console.log('incoming:'+JSON.stringify(event));
    handle_Block_Click(event.event.blockId);
  });
  
  function fire(event) {
      let data = {
          playerId:playerId , 
          event : event     
      };
      console.log('emitting '+JSON.stringify(data));
      socket.emit('event', data);
  }

/*---------------------------------------------------------*/    
/* Defining functions to calculate and mange moves pieces  */

function handle_Block_Click(id)
{
    
    //analyzing.
    e = document.getElementById(id);
    var r=parseInt(id.substring(1,2));
    var c=parseInt(id.substring(2,3));
    //console.log(id+" "+r+" "+c+" "+blocks[r-1][c-1]);
    var r1,c1;
    r--;c--;
    
    if(clicked!=null)
    {
        id=clicked.getAttribute("id");
        r1=parseInt(id.substring(1,2));
        c1=parseInt(id.substring(2,3));
        //console.log(id+" "+r1+" "+c1+" "+blocks[r1-1][c1-1]);
        r1--;c1--;
    }
    
    if(clicked==null)
    {
        if(!hasPiece(new Position(r+1,c+1)))
            return false;
        else if(!((cplayer<0&&blocks[r][c]<0)||(cplayer>0&&blocks[r][c]>0)))
            return false;
        
        e.style.border="3px solid blue";
        e.style.borderRadius="50%";
        clicked=e;
        show_Valid_Moves(e);
    }else if((blocks[r][c]<0&&blocks[r1][c1]<0)||(blocks[r][c]>0&&blocks[r1][c1]>0))
    {
        console.log("\nHomo click");
        //clearing current selected.
        clicked.style.border="";
        clicked.style.borderRadius="0px";
        clear_Green_Marked();
        
        e.style.border="3px solid blue";
        e.style.borderRadius="50%";
        clicked=e;
        show_Valid_Moves(e);
    }else
    {
        move(e);
    }
    return true;
}

function move(e)
{
    
    if(green_marked.indexOf(e)<0)
        return false;
    var p1=getPosition(e);
    var p2=getPosition(clicked);
    
    updateOutCount(p1);
    
    blocks[p1.i][p1.j]=blocks[p2.i][p2.j];
    blocks[p2.i][p2.j]=0;
    
    var ie=document.getElementById("i"+e.getAttribute("id"));
    var iclicked=document.getElementById("i"+clicked.getAttribute("id"));
    ie.style.background=iclicked.style.background;
    iclicked.style.background="";
    clicked.style.border="";
    clicked.style.borderRadius="";
    clicked=null;
    clear_Green_Marked();
    
    //swapping player
    if(cplayer<0)
        cplayer=1;
    else
        cplayer=-1;
    
    return true;
}

function getPosition(e)
{
    id=e.getAttribute("id");
    var r=parseInt(id.substring(1,2));
    var c=parseInt(id.substring(2,3));
    return new Position(r-1,c-1);
}

//return true if e1 & e2 are off same players.
function isHomo(e1,e2)
{
    var p1,p2;
    if(!isNaN(e1)&&!isNaN(e2))
    {
        if((e1<0&&e2<0)||(e1>0||e2>0))
            return true;
        else
            return false;
    }
    if(e1.constructor.name=="Position"&&e2.constructor.name=="Position")
    {
        p1=e1;
        p2=e2;
        console.log(" checking e1 e2"+e1+" "+e2);
    }else
    {
     p1=getPosition(e1);
     p2=getPosition(e2);
    }
    var r=p1.i,c=p1.j;
    var r1=p2.i,c1=p2.j;
    r--;c--;
    r1--;c1--;
    if((blocks[r][c]<0&&blocks[r1][c1]<0)||(blocks[r][c]>0&&blocks[r1][c1]>0))
        return true;
    else
        return false;
}

function hasPiece(pos)
{
    if(blocks[pos.i-1][pos.j-1]!=0)
        return true;
    else
        return false;
}

function show_Valid_Moves(s)
{
    //synthesizing parameters.
    var id=s.getAttribute("id");
    var r=parseInt(id.substring(1,2));
    var c=parseInt(id.substring(2,3));
    //console.log(id+" "+r+" "+c+" "+blocks[r-1][c-1]);
    
    //getting posible moves.
    var pos=new Position(r,c);
    var m=possible_moves(blocks[r-1][c-1],pos);
    
    //showing possible moves.
    if(m!=null)
        for(var i=0;i<m.length;i++)
        {
            var pos=m[i];
            var id="b"+pos.i+""+pos.j;
            //console.log(" Formed Id : "+id);
            var be=document.getElementById(id);
            be.style.border="3px solid #0f0";
            be.style.borderRadius="50%";
            green_marked.push(be);
        }
}

function filter_Possible_Moves(pos,pmv)
{
    if(Math.abs(blocks[pos.i-1][pos.j-1])==1)
    {
        for(var i=0;i<pmv.length;i++)
        {
                    
        }
    }
}
function clear_Green_Marked()
{
    //console.log("\nClearing "+green_marked.length);
    for(var i=0;i<green_marked.length;i++)
    {
        green_marked[i].style.border="";
        green_marked[i].style.borderRadius="0px";
    }
    green_marked=[];
    //console.log("\nCleared "+green_marked.length);
}

function possible_moves(id,posi)
{
    if(Math.abs(id)==12)
    {
        return possible_moves(2,posi).concat(possible_moves(8,posi));        
    }
    var pmoves=[];
    //console.log("\n ID from blocks : "+id);
    for(var i=0;i<pcs.length;i++)
    {
        //console.log("\n Piece Id : "+pcs[i].id+" \n Possible Moves");
        if(id==pcs[i].id||-1*id==pcs[i].id)
        for(var j=0;j<pcs[i].mv.length;j++)
        {

            if(!pcs[i].dynamic)
            {
                var pos=new Position(posi.i,posi.j);
                if(id==1||id==-1)
                    pos=pcs[i].mv[j](pos,id);
                else
                    pos=pcs[i].mv[j](pos);
                if(isValidPosition(pos))
                {
                        if(!pcs[i].filters[j](posi,pos))
                            continue;
                    
                    pmoves.push(pos);
                    //console.log("\n pos "+pos.i+" "+pos.j);
                }
            }else
            {
                for(var k=1;k<8;k++)
                {
                    var pos=new Position(posi.i,posi.j);
                    pos=pcs[i].mv[j](pos,k);
                    
                    if(isValidPosition(pos))
                    {
                        if(hasPiece(pos))
                        if(isHomo(posi,pos))
                            break;
                        pmoves.push(pos);
                        
                        if(hasPiece(pos))
                            break;
                        
                        //console.log("\npos "+pos.i+" "+pos.j);
                    }
                }
            }
        }
    }
    
    //console.log("\nMoves:")
    for(var i=0;i<pmoves.length;i++)
    {
        var pos=pmoves[i];
        //console.log("\t "+pos.i+" "+pos.j);        
    }

    return pmoves;
}

/*------------------------------------------------------------------------*/

/*  Defination and initilization of pices with id and moves and filters  */

function Piece(id,dyn)
{
    this.id=id;
    this.dynamic=dyn;
}

function Position(i,j)
{
    this.i=i;
    this.j=j;
}

function isValidPosition(pos)
{
    if((pos.i>0&&pos.i<9)&&(pos.j>0&&pos.j<9))
        return true;
    else
        return false;
}

//defining pieces array
var pcs=[new Piece(1,false),new Piece(2,true),new Piece(5,false),new Piece(8,true),
        new Piece(10,false)];
/*
defining function which will calculate move for each piece.
*/

//for pawn with piece with id 1
pcs[0].mv=[
                function(pos,n){ pos.i=pos.i+1*n; return pos;},
                function(pos,n){ pos.i=pos.i+2*n; return pos;},
                function(pos,n){ pos.i=pos.i+1*n; pos.j=pos.j+1; return pos;},
                function(pos,n){ pos.i=pos.i+1*n; pos.j=pos.j-1; return pos;}
             ];

//setting filter for pawn moves
pcs[0].filters=[
    function(p,fp){
        if(hasPiece(fp)) return false; else return true; },
    function(p,fp){
        if((blocks[p.i-1][p.j-1]==-1&&p.i!=7)||(blocks[p.i-1][p.j-1]==1&&p.i!=2))          return false;
        return true;},
    function(p,fp){
        if(hasPiece(fp)&&!isHomo(p,fp)) return true; else return false;},
    function(p,fp){return pcs[0].filters[2](p,fp);}
               ];

//for rook with id 2
pcs[1].mv=[
    function(pos,n){ pos.i=pos.i-n; return pos;},
    function(pos,n){ pos.i=pos.i+n; return pos;},
    function(pos,n){ pos.j=pos.j-n; return pos;},
    function(pos,n){ pos.j=pos.j+n; return pos;}
];

//for knight with id 5
pcs[2].mv=[
            function(pos){pos.i=pos.i+2; pos.j=pos.j-1; return pos;},
            function(pos){pos.i=pos.i+2; pos.j=pos.j+1; return pos;},
            function(pos){pos.i=pos.i-2; pos.j=pos.j-1; return pos;},
            function(pos){pos.i=pos.i-2; pos.j=pos.j+1; return pos;},
            function(pos){pos.i=pos.i-1; pos.j=pos.j+2; return pos;},
            function(pos){pos.i=pos.i-1; pos.j=pos.j-2; return pos;},
            function(pos){pos.i=pos.i+1; pos.j=pos.j+2; return pos;},
            function(pos){pos.i=pos.i+1; pos.j=pos.j-2; return pos;}
];
//filters for kinght 
pcs[2].filters=[
    function(p,fp){ return !(hasPiece(fp)&&isHomo(p,fp)); },
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);}
];

//for beshop with id 8
pcs[3].mv=[
    function(pos,n){ pos.i=pos.i+n; pos.j=pos.j-n; return pos;},
    function(pos,n){ pos.i=pos.i+n; pos.j=pos.j+n; return pos;},
    function(pos,n){ pos.i=pos.i-n; pos.j=pos.j-n; return pos;},
    function(pos,n){ pos.i=pos.i-n; pos.j=pos.j+n; return pos;}
];

//for king with piece with id 10
pcs[4].mv=[
    function(pos){ pos.i=pos.i+1; return pos;},
    function(pos){ pos.i=pos.i-1; return pos;},
    function(pos){ pos.j=pos.j+1; return pos;},
    function(pos){ pos.j=pos.j-1; return pos;},
    function(pos){ pos.i=pos.i-1; pos.j=pos.j-1; return pos;},
    function(pos){ pos.i=pos.i-1; pos.j=pos.j+1; return pos;},
    function(pos){ pos.i=pos.i+1; pos.j=pos.j-1; return pos;},
    function(pos){ pos.i=pos.i+1; pos.j=pos.j+1; return pos;}
             ];
//filters for king
pcs[4].filters=[
    function(p,fp){ return !(hasPiece(fp)&&isHomo(p,fp)); },
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);},
    function(p,fp){ return pcs[2].filters[0](p,fp);}
];


/*------------------------------------------------------------------*/


/*------------- testing initilized pices & moves----------------*/
function test1()
{
for(var i=0;i<pcs.length;i++)
{
    document.write("<br> Piece Id : "+pcs[i].id+" <br> Possible Moves");
    
    for(var j=0;j<pcs[i].mv.length;j++)
    {
        
        if(!pcs[i].dynamic)
        {
            var pos=new Position(4,4);
            //console.log(" "+(pos.constructor.name=="Position"?"true":"false"));
            pos=pcs[i].mv[j](pos);
            if(isValidPosition(pos))
                document.write("<br> pos "+pos.i+" "+pos.j);
        }else
        {
            for(var k=1;k<8;k++)
            {
                var pos=new Position(4,4);
                pos=pcs[i].mv[j](pos,k);
                if(isValidPosition(pos))
                    document.write("<br> pos "+pos.i+" "+pos.j);
            }
        }
    }
}
}

/*--------------------------------------------------------------*/

/*--------------------------------------------------------------
    Functions and data for keeping track of removed players.
--------------------------------------------------------------*/
var outs=[
    [[12,0],[8,0],[5,0],[2,0],[1,0]],
    [[-12,0],[-8,0],[-5,0],[-2,0],[-1,0]]
];
var pieces_icons=[
    [[1,"pawn1.png"],[2,"rook1.png"],[5,"knight1.png"],[8,"bishop1.png"],[10,"king1.png"],[12,"queen1.png"]],
    [[-1,"pawn2.png"],[-2,"rook2.png"],[-5,"knight2.png"],[-8,"bishop2.png"],[-10,"king2.png"],[-12,"queen2.png"]]
];

function updateOutCount(pos)
{
    for(var i=0;i<outs[0].length;i++)
    {
        var p=blocks[pos.i][pos.j];
        if(Math.abs(p)==outs[0][i][0])
        {
            if(p>0)
            {
                outs[0][i][1]++; 
                document.getElementById("opcnt1"+i).innerHTML=""+outs[0][i][1];
            }else
            {
                outs[1][i][1]++;
                document.getElementById("opcnt2"+i).innerHTML=""+outs[1][i][1];
            }
            //changeBodyBackground();
        }
    }
}