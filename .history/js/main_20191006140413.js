
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

let playerPrfo = {
    username : ''
};

function init() {
  axios.post('/check-invite',{}).then((res)=>{
    console.log(res.data);
    playerPrfo = res.data;
  });
}

function sendRequest() {

}

