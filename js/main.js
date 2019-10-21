
$ = {};

if($.redirect==undefined)
$.redirect = (url) => {
    document.location = url;
}

if($.toggleClass==undefined)
$.toggleClass = (el , className) => {
  el.classList.toggle(className);
};

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
let sentInvites = [];

function init() {
  axios.post('/check-invite',{}).then((res)=>{
    console.log(res.data);
    playerPrfo = res.data;
    invites = res.data.invites;
    sentInvites = res.data.sentInvites;
    for(let listener of profLister)
      try {
        listener(res.data);
      }catch(e){  }

  });
}

function updateInvitesList(res) {
  let html = '';
  let invStatus = {
    '1' : 'received' ,
    '2' : 'accepted' ,
    '3' : 'accepted & verified' ,
    '4' : 'rejected'
  };

  for( invt of invites) {
    html+=`<div class="card-item"> 
        <div class="card-item-title" > Invitation from ` + invt.from + `</div>
        <div class="card-item-body"> Invite has been `+invStatus[invt.status]+` </div> `;
    html+= invt.status==1 ? 
          `<button class="btn blue" onclick='acceptInv("`+invt.inviteId+`")'>Accept</button>
          <button class="btn red" onclick='rejectInv("`+invt.inviteId+`")'>Reject</button>` :
          invt.status == 4 ? `<button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>` : 
          `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>
           <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>`
          ;

    html+=`</div>`;
  }
  
  console.log(html);
  $.select('.invitation-list').innerHTML = html;
}

function updateSentInvitesList(res) {
  let html = '';
  let invStatus = {
    '1' : 'sent' ,
    '2' : 'accepted' ,
    '3' : 'accepted & verified' ,
    '4' : 'rejected'
  };

  for( invt of sentInvites) {
    html+=`<div class="card-item"> 
        <div class="card-item-title" > Invitation sent to ` + invt.to + `</div>
        <div class="card-item-body"> Invite has been `+invStatus[invt.status]+` </div>`;
    html+= invt.status==1 ? 
          `<button class="btn red" onclick='cancelInv("`+invt.inviteId+`")'>Cancel</button>` : 
          invt.status == 4 ?`
          <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>` :
          `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>
           <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>`
          ;
    html+=`</div>`;
  }
  
  console.log(html);
  $.select('.sent-invitation-list').innerHTML = html;
}
profLister.push(updateSentInvitesList);
profLister.push(updateInvitesList);

function openGame(id) {
  window.open('start?gameId='+id,'_blank');
}

function acceptInv(id) {
  console.log('aceepting '+id);
  axios.post('/accept-invite',{id:id}).then((res)=>{
    console.log('accepted : '+JSON.stringify(res.data));
    for(let invt of invites)
    if(invt.inviteId==id)
      invt.status = 3;

    updateInvitesList();
  });

}
function deleteInv(id) {
  console.log('deleting '+id);
  axios.post('/edit-invite',{id:id,action:'delete'}).then((res)=>{
    console.log('deleted : '+JSON.stringify(res.data));
    init();
    //updateInvitesList();
  });

}
function rejectInv(id) {
  console.log('deleting '+id);
  axios.post('/edit-invite',{id:id,action:'reject'}).then((res)=>{
    console.log('rejected : '+JSON.stringify(res.data));
    init();
    //updateInvitesList();
  });

}
init();