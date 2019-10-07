var self = $.select('input[name="self"]');
var opponant = $.select('input[name="opponant"]');

self.value = playerPrfo.username;

opponant.oninput = (e) => {
    console.log(opponant.value);

    if(opponant.value.length == 0)
        $.select('#send').classList.add('disabled');
    if(opponant.value.length > 0)
        $.select('#send').classList.remove('disabled');
};

function sendRequest() {

}
