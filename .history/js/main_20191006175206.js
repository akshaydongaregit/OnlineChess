
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

let playerPrfo = {};
let profLister = [];
let invites = [];
function init() {
  axios.post('/check-invite',{}).then((res)=>{
    console.log(res.data);
    playerPrfo = res.data;
    invites = res.data.invites;
    for(let listener of profLister)
      listener(res.data);
    updateInvitesList();
  });
}

function updateInvitesList() {
  let html = '';
  for( invt of invites) {
    html+=`<div class="card-item"> 
        <div class="card-item-title" > Invitation from ` + invt.from + `</div>
        <button class="btn blue" onclick='acceptInv("`+invt.from+`")'>Accept</button>
        <button class="btn red" onclick='acceptInv("`+invt.from+`")'>Reject</button>
      </div>`;
      console.log(html);
  }
  $.select('.invitation-list').innerHTML = html;
}

function acceptInv() {
  axios.post('/accept-invite',{from:'ak'}).then((res)=>{console.log(res.data)});
}

init();