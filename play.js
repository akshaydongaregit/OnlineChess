var blocks=[[2,5,8,10,12,8,5,2],[1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
            [-1,-1,-1,-1,-1,-1,-1,-1],[-2,-5,-8,-10,-12,-8,-5,-2]];
//alert(""+blocks[3][3]);

function move(s,d)
{
    
}
function valid_Moves(s)
{
    var id=s.getAttribute("id");
    var r=parseInt(id.substring(1,2));
    var c=parseInt(id.substring(2,3));
    alert(id+" "+r+" "+c+" "+blocks[r-1][c-1]);
    var m;
}