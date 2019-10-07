var self = $.select('input[name="self"]');
var opponant = $.select('input[name="opponant"]');

profLister.push( (res) => { 
    self.value = res.username;
});


opponant.oninput = (e) => {
    console.log(opponant.value);

    if(opponant.value.length == 0)
        $.select('#send').classList.add('disabled');
    if(opponant.value.length > 0)
        $.select('#send').classList.remove('disabled');
};

function sendRequest() {
    $.select('.spinner').classList.add('show');
    let invite = { to:opponant.value , gameId : playerPrfo.games[0].id};
    console.log('invite:'+JSON.stringify(invite));

    axios.post('/invite' , invite ).then( (res) => {
        let invt = res.data.invite;
        console.log('invite details : '+JSON.stringify());
        $.select('.spinner').classList.remove('show');
        $.select('.spinner').classList.add('hide');
        let html = `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>`;
        $.select('.status.open-btn').innerHTML = html;
    }).catch( (err) => {
        console.log('error : '+err);
        $.select('.spinner').classList.remove('show');
        $.select('.spinner').classList.add('hide');
    });    
}

             
function openGame(id) {
    window.open('start?gameId='+id,'_blank');
}