(function(){
var D=window.FLEET,app=document.getElementById('app');if(!D||!app)return;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var LBL=D.labels,bots=D.bots,byTeam={};
bots.forEach(function(b){(byTeam[b.team]=byTeam[b.team]||[]).push(b)});
function grp(s){return(s==='idle'||s==='paused'||s==='demo')?'idle':s}
var cnt={working:0,needs_brian:0,error:0,idle:0};
bots.forEach(function(b){cnt[grp(b.state)]++});

/* ---------- avatar: a small flat robot, tinted by the bot's own hue ---------- */
function headInner(b,uid){
  var h=b.hue,st=b.state,id='g'+uid,eye='#eef4ff',e='';
  var led='var(--sc)';
  if(st==='working'){
    e='<g class="eyes"><rect x="14" y="21" width="7" height="8" rx="3.5" fill="#6ee7b7"/><rect x="27" y="21" width="7" height="8" rx="3.5" fill="#6ee7b7"/></g>'+
      '<path d="M18 33.5q6 3 12 0" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round" fill="none"/>';
  }else if(st==='needs_brian'){
    e='<circle cx="17.5" cy="25" r="4" fill="'+eye+'"/><circle cx="30.5" cy="25" r="4" fill="'+eye+'"/><circle cx="19" cy="24" r="1.7" fill="#0b1020"/><circle cx="32" cy="24" r="1.7" fill="#0b1020"/>'+
      '<path d="M20 34h8" stroke="#fcd34d" stroke-width="2" stroke-linecap="round"/>';
  }else if(st==='error'){
    e='<path d="M14.5 22l6 6m0-6l-6 6M27.5 22l6 6m0-6l-6 6" stroke="#fca5a5" stroke-width="2.4" stroke-linecap="round"/><path d="M19 35q5-3 10 0" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" fill="none"/>';
  }else if(st==='paused'){
    e='<rect x="15" y="21" width="4" height="9" rx="1.6" fill="'+eye+'"/><rect x="21" y="21" width="4" height="9" rx="1.6" fill="'+eye+'"/><rect x="29" y="21" width="4" height="9" rx="1.6" fill="'+eye+'"/>';
  }else if(st==='demo'){
    e='<circle cx="17.5" cy="25" r="4" fill="#93c5fd"/><circle cx="30.5" cy="25" r="4" fill="#93c5fd"/><path d="M18 33q6 4 12 0" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" fill="none"/>';
  }else{ /* idle: relaxed, half-closed eyes */
    e='<path d="M13.5 26q4 3.4 8 0M26.5 26q4 3.4 8 0" stroke="'+eye+'" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".9"/><path d="M20 34h8" stroke="'+eye+'" stroke-width="2" stroke-linecap="round" opacity=".6"/>';
  }
  var blink=(st==='working'||st==='needs_brian'||st==='demo')?' style="--d:'+((uid%7)*0.7).toFixed(1)+'s"':'';
  return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'+
    '<stop offset="0" stop-color="hsl('+h+',78%,66%)"/><stop offset="1" stop-color="hsl('+h+',62%,44%)"/></linearGradient></defs>'+
    '<path class="ant" d="M24 12V6" stroke="hsl('+h+',40%,70%)" stroke-width="2" stroke-linecap="round"/><circle class="led" cx="24" cy="5" r="3" fill="'+led+'"/>'+
    '<rect x="2" y="21" width="4" height="10" rx="2" fill="hsl('+h+',55%,40%)"/><rect x="42" y="21" width="4" height="10" rx="2" fill="hsl('+h+',55%,40%)"/>'+
    '<rect x="5" y="12" width="38" height="31" rx="11" fill="url(#'+id+')"/>'+
    '<rect x="9" y="16" width="30" height="23" rx="8" fill="#0b1020" opacity=".86"/>'+
    '<g'+blink+' class="lid">'+e+'</g>';
}
function avatar(b,uid){return '<span class="av" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false">'+headInner(b,uid)+'</svg></span>'}
function chip(b){return '<span class="chip"><i></i>'+esc(LBL[b.state])+'</span>'}
var ROWAN_IMG='data:image/png;base64,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';

/* ---------- tabs ---------- */
var I={
 hub:'<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4"/>',
 all:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 rowan:'<path d="M3 17l2-9 5 4 2-7 2 7 5-4 2 9z"/><path d="M4 21h16"/>',
 'daily-papers':'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
 money:'<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.6-1-1.5-1.4-2.5-1.4-1.4 0-2.4.8-2.4 1.9 0 2.700 5 1.300 5 4 0 1.100-1.100 2-2.600 2-1.100 0-2.100-.5-2.700-1.500M12 6.500v1.600M12 15.900v1.600"/>',
 'home-life':'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
 'real-estate':'<path d="M3 21h18M6 21V8l6-5 6 5v13"/><path d="M10 21v-5h4v5M10 11h4"/>',
 marketing:'<path d="M3 10v4l11 4V6z"/><path d="M14 8.500a4 4 0 010 7M6 15l1.500 5h2.500l-1-4.500"/>',
 'tech-creative':'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M9 10l-2 2 2 2M15 10l2 2-2 2"/>',
 torka:'<circle cx="9" cy="8" r="3.200"/><path d="M3 20c0-3.300 2.700-5.500 6-5.500s6 2.200 6 5.500"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14.500c2.400 0 4 1.700 4 4.500"/>',
 need:'<path d="M6 17V11a6 6 0 0112 0v6l1.500 2h-15z"/><path d="M10 21a2 2 0 004 0"/>'
};
function ico(k){return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(I[k]||I.hub)+'</svg>'}


var need=bots.filter(function(b){return b.state==='needs_brian'||b.state==='error'});
var DEPT=D.tabs,BASE_MOVES=D.moves||{};
var T=[{id:'all',label:'All',icon:'all',list:bots,n:bots.length}];
DEPT.forEach(function(t){T.push({id:t.id,label:t.label,icon:t.id,list:[],n:0,team:t.team,dept:true})});
T.push({id:'needs-owner',label:'Needs the owner',icon:'need',list:need,n:need.length,warn:need.length>0});
var byId={};T.forEach(function(t){byId[t.id]=t});

/* ---------- moves (saved in this browser; override the built-in layout) ---------- */
var STORE='botcentral.moves',mem={};
function loadMoves(){try{var j=JSON.parse(localStorage.getItem(STORE)||'{}');return(j&&typeof j==='object'&&!Array.isArray(j))?j:{}}catch(e){return JSON.parse(JSON.stringify(mem))}}
function saveMoves(m){mem=JSON.parse(JSON.stringify(m));try{if(Object.keys(m).length)localStorage.setItem(STORE,JSON.stringify(m));else localStorage.removeItem(STORE)}catch(e){}}
function deptOf(x){var k=String(x).toLowerCase(),r=null;DEPT.forEach(function(t){if(t.label.toLowerCase()===k||t.team.toLowerCase()===k||t.id===k)r=t});return r}
var names={};bots.forEach(function(b){names[b.name]=1;b.team0=b.team});
var moves=loadMoves();
(function(){var c={};Object.keys(moves).forEach(function(n){var d=deptOf(moves[n]);if(names[n]&&d&&d.team!==bots.filter(function(b){return b.name===n})[0].team0)c[n]=d.label});moves=c})();
var byTeam={};
function apply(){
  byTeam={};
  bots.forEach(function(b){var d=moves[b.name]?deptOf(moves[b.name]):null;b.team=d?d.team:b.team0;b.moved=!!d;(byTeam[b.team]=byTeam[b.team]||[]).push(b)});
  T.forEach(function(t){if(t.dept){t.list=byTeam[t.team]||[];t.n=t.list.length}});
}
apply();

var uidN=0,stat=null,dragName=null;
function card(b){
  var u=uidN++,isR=(b.team==='Fleet lead'),av;
  av=isR?'<span class="av rw" aria-hidden="true"><img src="'+ROWAN_IMG+'" alt="" width="48" height="48"></span>':avatar(b,u);
  return '<article class="card s-'+b.state+(b.src==='live'?'':' rec')+(b.moved?' moved':'')+'" draggable="true" data-n="'+esc(b.name)+'" data-g="'+grp(b.state)+'">'+av+
    '<div class="cb"><div class="ch"><h3>'+esc(b.name)+'</h3>'+chip(b)+'</div><p class="tk">'+esc(b.task)+'</p>'+
    '<div class="wh"><span>'+esc(b.when)+(b.src==='live'?'':' · from records')+(b.moved?' · moved by you':'')+'</span>'+
    '<button type="button" class="mvb" data-mv="'+esc(b.name)+'" aria-haspopup="dialog" aria-label="Move '+esc(b.name)+' to another department">Move to…</button></div></div></article>';
}
function grid(list){return '<div class="cards">'+list.map(card).join('')+'</div>'}
function panelHtml(t){
  if(t.id==='all'){
    var out='',seen={};
    DEPT.forEach(function(x){var l=byTeam[x.team]||[];seen[x.team]=1;
      out+='<section class="grp" data-dept="'+x.id+'"><h2><a href="#'+x.id+'">'+esc(x.label)+'</a><span>'+l.length+'</span></h2>'+(l.length?grid(l):'<p class="empty small">Drop a bot here</p>')+'</section>'});
    Object.keys(byTeam).forEach(function(k){if(seen[k])return;out+='<section class="grp"><h2>Other<span>'+byTeam[k].length+'</span></h2>'+grid(byTeam[k])+'</section>'});
    return out;
  }
  if(!t.list.length)return '<p class="empty">'+(t.id==='needs-owner'?'Nothing needs the owner right now.':'No bots here yet. Drag a card onto this tab, or use “Move to…” on a card.')+'</p>';
  return (t.id==='needs-owner'?'<p class="lead">Bots that are waiting on the owner or are stuck.</p>':'')+grid(t.list);
}

var h='<a class="skip" href="#panel">Skip to content</a><div class="wrap"><header class="top"><div class="brand">'+
  '<h1 class="tab title">'+ico('hub')+'<span>BOT CENTRAL</span></h1>'+
  '<div class="sub"><span class="pulse" aria-hidden="true"></span><span>Updated '+esc(D.updated)+'</span></div></div>';
var stats=[['working','working'],['needs_brian','need the owner'],['error','stuck'],['idle','idle']];
h+='<section class="stats" aria-label="Fleet summary (select to highlight)">';
stats.forEach(function(s){h+='<button type="button" class="stat k-'+s[0]+'" data-f="'+s[0]+'" aria-pressed="false"><span class="dot"></span><span class="n">'+cnt[s[0]]+'</span><span class="l">'+s[1]+'</span></button>'});
h+='</section></header>';
h+='<nav class="tabs" aria-label="Departments"><div class="tablist" role="tablist">';
T.forEach(function(t){h+='<a class="tab'+(t.warn?' warn':'')+(t.dept?' dept':'')+'" role="tab" id="tab-'+t.id+'" href="#'+t.id+'" aria-controls="panel" aria-selected="false" tabindex="-1">'+ico(t.icon)+'<span class="lb">'+esc(t.label)+'</span><span class="ct">'+t.n+'</span></a>'});
h+='</div></nav><main id="panel" class="panel" role="tabpanel" tabindex="-1"></main>'+
  '<footer class="foot"><span class="hint">Drag a card onto a tab, or tap “Move to…”. Moves are saved on this device only.</span>'+
  '<span class="fb"><button type="button" class="lnk" id="exp">Export layout</button><button type="button" class="lnk" id="rst">Reset</button></span></footer></div>'+
  '<div id="toast" role="status" aria-live="polite"></div><div id="ov" hidden></div>';
app.innerHTML=h;

var panel=document.getElementById('panel'),tabEls=app.querySelectorAll('.tablist .tab'),toastEl=document.getElementById('toast'),ov=document.getElementById('ov');
function curId(){var x=decodeURIComponent((location.hash||'').replace(/^#/,''));return byId[x]?x:'all'}
function applyStat(){
  panel.classList.toggle('filtering',!!stat);
  var cs=panel.querySelectorAll('.card');
  for(var i=0;i<cs.length;i++)cs[i].classList.toggle('dim',!!stat&&cs[i].getAttribute('data-g')!==stat);
  var ss=app.querySelectorAll('.stat');
  for(var j=0;j<ss.length;j++)ss[j].setAttribute('aria-pressed',String(ss[j].getAttribute('data-f')===stat));
}
function render(keepScroll){
  var id=curId(),t=byId[id];uidN=0;
  panel.innerHTML=panelHtml(t);panel.setAttribute('aria-labelledby','tab-'+id);
  for(var i=0;i<tabEls.length;i++){
    var tid=tabEls[i].id.slice(4),on=tid===id;tabEls[i].classList.toggle('on',on);
    tabEls[i].querySelector('.ct').textContent=byId[tid].n;
    tabEls[i].setAttribute('aria-selected',String(on));tabEls[i].setAttribute('tabindex',on?'0':'-1');
    if(on&&!keepScroll&&tabEls[i].scrollIntoView){var tl=tabEls[i].parentNode;var l=tabEls[i].offsetLeft-(tl.clientWidth-tabEls[i].offsetWidth)/2;tl.scrollLeft=Math.max(0,l)}
  }
  document.title=(id==='all'?'':t.label+' · ')+'Bot Central';
  applyStat();
}
var tt=null;
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('on')},3500)}
function moveBot(name,deptId){
  var d=byId[deptId];if(!d||!d.dept||!names[name])return false;
  var b=bots.filter(function(x){return x.name===name})[0];
  if(b.team===d.team)return false;
  if(d.team===b.team0)delete moves[name];else moves[name]=d.label;
  saveMoves(moves);apply();render(true);
  toast('Moved '+name+' to '+d.label);return true;
}
window.addEventListener('hashchange',function(){render()});
render();

/* ---------- overlay (Move-to menu, export) ---------- */
var lastFocus=null;
function openOv(html,focusSel){lastFocus=document.activeElement;ov.innerHTML=html;ov.hidden=false;document.body.classList.add('modal');var f=ov.querySelector(focusSel||'button');f&&f.focus()}
function closeOv(){ov.hidden=true;ov.innerHTML='';document.body.classList.remove('modal');if(lastFocus&&document.body.contains(lastFocus))lastFocus.focus&&lastFocus.focus();lastFocus=null}
function moveMenu(name){
  var b=bots.filter(function(x){return x.name===name})[0];if(!b)return;
  var s='<div class="bd" data-close="1"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t"><h2 id="sh-t">Move '+esc(name)+' to…</h2><div class="opts">';
  DEPT.forEach(function(d){var cur=d.team===b.team;
    s+='<button type="button" class="opt'+(cur?' cur':'')+'" data-to="'+d.id+'" data-nm="'+esc(name)+'"'+(cur?' aria-current="true"':'')+'>'+ico(d.id)+'<span>'+esc(d.label)+'</span>'+(cur?'<em>current</em>':'')+'</button>'});
  s+='</div><button type="button" class="cancel" data-close="1">Cancel</button></div>';
  openOv(s,'.opt:not(.cur)');
}
function layoutJson(){var o={};Object.keys(BASE_MOVES).forEach(function(k){o[k]=BASE_MOVES[k]});Object.keys(moves).forEach(function(k){o[k]=moves[k]});
  return JSON.stringify(o,null,2)}
function exportSheet(){
  var j=layoutJson(),n=Object.keys(moves).length;
  openOv('<div class="bd" data-close="1"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t"><h2 id="sh-t">Export layout</h2>'+
    '<p class="lead">'+(n?n+' move'+(n===1?'':'s')+' saved on this device.':'No moves saved on this device yet.')+' Paste this into <code>moves.json</code> and rebuild to make it permanent for everyone.</p>'+
    '<textarea id="xj" readonly rows="8" spellcheck="false" aria-label="Layout JSON">'+esc(j)+'</textarea>'+
    '<div class="row"><button type="button" class="opt go" id="cp">Copy</button><button type="button" class="cancel" data-close="1">Close</button></div></div>','#xj');
}
function copyText(txt){
  var x=document.getElementById('xj');
  if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(txt).then(function(){return true},function(){return fb()})}
  return Promise.resolve(fb());
  function fb(){try{x.focus();x.select();return document.execCommand('copy')}catch(e){return false}}
}

/* ---------- interaction ---------- */
app.addEventListener('click',function(e){
  var el=e.target.closest?e.target:null;if(!el)return;
  var s=el.closest('.stat');
  if(s){var f=s.getAttribute('data-f');stat=(stat===f)?null:f;applyStat();return}
  var m=el.closest('[data-mv]');if(m){moveMenu(m.getAttribute('data-mv'));return}
  var o=el.closest('.opt[data-to]');if(o){var nm=o.getAttribute('data-nm'),to=o.getAttribute('data-to');closeOv();moveBot(nm,to);return}
  if(el.closest('#cp')){copyText(document.getElementById('xj').value).then(function(ok){var c=document.getElementById('cp');if(c)c.textContent=ok?'Copied':'Select the text and copy it'});return}
  if(el.closest('[data-close]')){closeOv();return}
  if(el.closest('#exp')){exportSheet();return}
  if(el.closest('#rst')){
    if(!Object.keys(moves).length){toast('No local moves to reset');return}
    if(window.confirm('Put every bot back in its original department on this device?')){moves={};saveMoves(moves);apply();render(true);toast('Layout reset')}
  }
});
app.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&!ov.hidden){closeOv();return}
  if(e.key==='Tab'&&!ov.hidden){var f=ov.querySelectorAll('button,textarea'),first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}return}
  var t=e.target.closest&&e.target.closest('.tablist .tab');if(!t)return;
  var i=Array.prototype.indexOf.call(tabEls,t),n=-1;
  if(e.key==='ArrowRight')n=(i+1)%tabEls.length;else if(e.key==='ArrowLeft')n=(i-1+tabEls.length)%tabEls.length;
  else if(e.key==='Home')n=0;else if(e.key==='End')n=tabEls.length-1;
  if(n>=0){e.preventDefault();location.hash=tabEls[n].getAttribute('href');tabEls[n].focus()}
});

/* drag a card onto a department tab (or, on All, onto a department block) */
var hot=null;
function targetOf(e){
  var t=e.target.closest&&e.target.closest('.tablist .tab.dept');if(t)return{el:t,id:t.id.slice(4)};
  var g=e.target.closest&&e.target.closest('.grp[data-dept]');if(g)return{el:g,id:g.getAttribute('data-dept')};
  var p=e.target.closest&&e.target.closest('#panel');var c=curId();if(p&&byId[c]&&byId[c].dept)return{el:p,id:c};
  return null;
}
function clearHot(){if(hot){hot.classList.remove('drop');hot=null}}
function endDrag(){clearHot();dragName=null;document.body.classList.remove('dragging');var d=app.querySelector('.card.dragging');d&&d.classList.remove('dragging')}
app.addEventListener('dragstart',function(e){
  var c=e.target.closest&&e.target.closest('.card');if(!c){return}
  dragName=c.getAttribute('data-n');c.classList.add('dragging');document.body.classList.add('dragging');
  try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragName)}catch(x){}
});
app.addEventListener('dragover',function(e){
  if(!dragName)return;
  var tl=e.target.closest&&e.target.closest('.tablist');
  if(tl){var r=tl.getBoundingClientRect();if(e.clientX<r.left+50)tl.scrollLeft-=14;else if(e.clientX>r.right-50)tl.scrollLeft+=14}
  var t=targetOf(e);
  if(!t){clearHot();try{e.dataTransfer.dropEffect='none'}catch(x){}return}
  e.preventDefault();try{e.dataTransfer.dropEffect='move'}catch(x){}
  if(hot!==t.el){clearHot();hot=t.el;hot.classList.add('drop')}
});
app.addEventListener('dragleave',function(e){if(e.clientX<=0||e.clientY<=0||e.clientX>=window.innerWidth||e.clientY>=window.innerHeight)clearHot()});
app.addEventListener('drop',function(e){
  if(!dragName)return;var t=targetOf(e);if(!t)return;
  e.preventDefault();var n=dragName;endDrag();moveBot(n,t.id);
});
app.addEventListener('dragend',endDrag);
})();
