(function(){
var D=window.FLEET,app=document.getElementById('app');if(!D||!app)return;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var LBL=D.labels,bots=D.bots,byTeam={};
bots.forEach(function(b){(byTeam[b.team]=byTeam[b.team]||[]).push(b)});
function grp(s){return(s==='idle'||s==='paused'||s==='demo')?'idle':s}
var cnt={working:0,needs_brian:0,error:0,idle:0};
bots.forEach(function(b){cnt[grp(b.state)]++});

/* ---------- avatar: a small flat robot, tinted by the bot's own hue ---------- */
function avatar(b,uid){
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
  return '<span class="av" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'+
    '<stop offset="0" stop-color="hsl('+h+',78%,66%)"/><stop offset="1" stop-color="hsl('+h+',62%,44%)"/></linearGradient></defs>'+
    '<path class="ant" d="M24 12V6" stroke="hsl('+h+',40%,70%)" stroke-width="2" stroke-linecap="round"/><circle class="led" cx="24" cy="5" r="3" fill="'+led+'"/>'+
    '<rect x="2" y="21" width="4" height="10" rx="2" fill="hsl('+h+',55%,40%)"/><rect x="42" y="21" width="4" height="10" rx="2" fill="hsl('+h+',55%,40%)"/>'+
    '<rect x="5" y="12" width="38" height="31" rx="11" fill="url(#'+id+')"/>'+
    '<rect x="9" y="16" width="30" height="23" rx="8" fill="#0b1020" opacity=".86"/>'+
    '<g'+blink+' class="lid">'+e+'</g></svg></span>';
}
function chip(b){return '<span class="chip"><i></i>'+esc(LBL[b.state])+'</span>'}

/* ---------- page ---------- */
var gi=0,ri=0;function desk(b){var i=gi++;return '<button type="button" class="t s-'+b.state+(b.src==='live'?'':' rec')+'" data-i="'+bots.indexOf(b)+'" data-g="'+grp(b.state)+'" aria-label="'+esc(b.name+', '+LBL[b.state]+'. '+b.task)+'">'+avatar(b,i)+'<span class="tx"><span class="nm">'+esc(b.name)+'</span>'+chip(b)+'<span class="tk">'+esc(b.task)+'</span></span></button>'}
var ph=byTeam['Fleet lead']||[];
var h='<a class="skip" href="#main">Skip to content</a><div class="wrap">';
if(ph.length){h+='<section class="floor penthouse" aria-label="Penthouse" style="margin-bottom:18px;border-radius:16px;overflow:hidden"><div class="room r0" style="flex:1 1 0"><h3>Penthouse<small>'+ph.length+'</small></h3><div class="desks">';ph.forEach(function(b){h+=desk(b)});h+='</div></div></section>';ri++}
h+='<header class="top"><div class="brand"><span class="logo" aria-hidden="true">'+
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4"/></svg></span>'+
  '<div><h1>Fleet Office</h1><div class="sub"><span class="pulse" aria-hidden="true"></span><span>Updated '+esc(D.updated)+'</span></div></div></div></header><main id="main">';
var stats=[['working','working'],['needs_brian','need the owner'],['error','stuck'],['idle','idle']];
h+='<section class="stats" aria-label="Fleet summary (select to highlight)">';
stats.forEach(function(s){h+='<button type="button" class="stat k-'+s[0]+'" data-f="'+s[0]+'" aria-pressed="false"><span class="dot"></span><span class="tx"><span class="n">'+cnt[s[0]]+'</span><span class="l">'+s[1]+'</span></span></button>'});
h+='</section>';

var need=bots.filter(function(b){return b.state==='needs_brian'||b.state==='error'});
h+='<section class="need" aria-labelledby="need-h"><div class="sec-h"><h2 id="need-h">Needs the owner</h2><span>'+need.length+' open</span></div><div class="need-grid">';
if(!need.length)h+='<div class="card ok"><div class="tx"><p>Nothing needs attention right now.</p></div></div>';
need.forEach(function(b,k){
  h+='<div class="card s-'+b.state+'" style="animation-delay:'+(k*0.05).toFixed(2)+'s">'+avatar(b,500+bots.indexOf(b))+'<div class="tx"><div class="hd"><b>'+esc(b.name)+'</b>'+chip(b)+'</div><p>'+esc(b.task)+'</p></div></div>';
});
h+='</div></section>';

h+='<section aria-labelledby="tower-h"><div class="sec-h"><h2 id="tower-h">The tower</h2><span>Tap a bot for details</span></div><div class="tower"><div class="roof"><div class="sign"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M6 21V8l6-5 6 5v13"/></svg>BOT CENTRAL</div><div class="mast" aria-hidden="true"></div></div>'+
  '<div class="building"><div class="shaft" aria-hidden="true"><div class="cab"></div></div><div class="floors">';
var total=D.floors.length;
D.floors.forEach(function(f,fi){
  h+='<section class="floor" aria-label="'+esc(f.name)+'"><span class="fl-tag" aria-hidden="true"><b>'+(total-fi)+'F</b></span>';
  f.rooms.forEach(function(r){
    var list=byTeam[r.team]||[];
    h+='<div class="room r'+(ri%6)+'" style="flex:'+Math.max(1,Math.min(list.length,6))+' 1 0"><h3>'+esc(r.label)+'<small>'+list.length+'</small></h3><div class="desks">';
    list.forEach(function(b){
      h+=desk(b);
    });
    h+='</div></div>';ri++;
  });
  h+='</section>';
});
h+='</div><div class="lobby lobby-row"><span class="door" aria-hidden="true"></span>Lobby<span class="door" aria-hidden="true"></span></div></div></div></section>';
h+='<p class="foot">'+D.live_count+' of '+D.total+' bots have a live report; dashed outlines show what the bot’s records said earlier. Times are CST with PST in parentheses.</p></main></div>'+
  '<div id="tip" role="dialog" aria-label="Bot details" aria-live="polite"></div>';
app.innerHTML=h;

/* ---------- interaction ---------- */
var tip=document.getElementById('tip'),on=null,filt=null;
function show(t){
  if(on)on.classList.remove('on');on=t;t.classList.add('on');
  var b=bots[+t.getAttribute('data-i')];
  tip.className='s-'+b.state;tip.style.setProperty('--sc','var(--c-'+b.state+')');
  tip.innerHTML='<button type="button" class="x" aria-label="Close details">&times;</button><div class="hd"><b>'+esc(b.name)+'</b>'+chip(b)+'</div><p>'+esc(b.task)+'</p><small>'+esc(b.when)+' · '+(b.src==='live'?'live report':'from records')+'</small>';
  tip.style.display='block';
}
function hide(){tip.style.display='none';if(on){on.classList.remove('on');on.focus&&on.focus({preventScroll:true})}on=null}
function applyFilter(){
  var ts=document.querySelectorAll('.t');
  for(var i=0;i<ts.length;i++)ts[i].classList.toggle('dim',!!filt&&ts[i].getAttribute('data-g')!==filt);
  var ss=document.querySelectorAll('.stat');
  for(var j=0;j<ss.length;j++)ss[j].setAttribute('aria-pressed',String(ss[j].getAttribute('data-f')===filt));
}
document.addEventListener('click',function(e){
  var x=e.target.closest&&e.target.closest('.x');if(x){hide();return}
  var s=e.target.closest&&e.target.closest('.stat');
  if(s){var f=s.getAttribute('data-f');filt=(filt===f)?null:f;applyFilter();return}
  var t=e.target.closest&&e.target.closest('.t');
  if(t){show(t);return}
  if(!(e.target.closest&&e.target.closest('#tip'))){if(on){on.classList.remove('on');on=null}tip.style.display='none'}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&on)hide()});
})();
