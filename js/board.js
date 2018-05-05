//setting board
document.getElementById("ib11").setAttribute("style","background:url('img/icons/rook1.png');background-size:cover");
document.getElementById("ib18").setAttribute("style","background:url('img/icons/rook1.png');background-size:cover");
document.getElementById("ib12").setAttribute("style","background:url('img/icons/knight1.png');background-size:cover");
document.getElementById("ib17").setAttribute("style","background:url('img/icons/knight1.png');background-size:cover");
document.getElementById("ib13").setAttribute("style","background:url('img/icons/bishop1.png');background-size:cover");
document.getElementById("ib16").setAttribute("style","background:url('img/icons/bishop1.png');background-size:cover");
document.getElementById("ib14").setAttribute("style","background:url('img/icons/king1.png');background-size:cover");
document.getElementById("ib15").setAttribute("style","background:url('img/icons/queen1.png');background-size:cover");
for(var i=1;i<9;i++)
{
    document.getElementById("ib2"+i+"").setAttribute("style","background:url('img/icons/pawn1.png');background-size:cover");
}

document.getElementById("ib81").setAttribute("style","background:url('img/icons/rook2.png');background-size:cover");
document.getElementById("ib88").setAttribute("style","background:url('img/icons/rook2.png');background-size:cover");
document.getElementById("ib82").setAttribute("style","background:url('img/icons/knight2.png');background-size:cover");
document.getElementById("ib87").setAttribute("style","background:url('img/icons/knight2.png');background-size:cover");
document.getElementById("ib83").setAttribute("style","background:url('img/icons/bishop2.png');background-size:cover");
document.getElementById("ib86").setAttribute("style","background:url('img/icons/bishop2.png');background-size:cover");
document.getElementById("ib84").setAttribute("style","background:url('img/icons/king2.png');background-size:cover");
document.getElementById("ib85").setAttribute("style","background:url('img/icons/queen2.png');background-size:cover");
for(var i=1;i<9;i++)
{
    document.getElementById("ib7"+i+"").setAttribute("style","background:url('img/icons/pawn2.png');background-size:cover");
}

updatePlayerNote();