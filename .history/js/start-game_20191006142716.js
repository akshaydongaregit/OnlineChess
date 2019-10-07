var self = $.select('input[name="self"]');
var opponant = $.select('input[name="opponant"]');

opponant.oninput = (e) => {
    console.log(opponant.value);
    
    if(opponant.value.length > 0)
        $.toggleClass($.select('#send') , 'disabled');
};

function sendRequest() {

}
