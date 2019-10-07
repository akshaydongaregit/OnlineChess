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
    axios.post('/invite' , invite ).then( (res) => {
        console.log('invite details : '+res.data);
        $.select('.spinner').classList.add('hide');
    }).catch( (err) => {
        console.log('error : '+err);
        $.select('.spinner').classList.add('hide');
    });    
}
