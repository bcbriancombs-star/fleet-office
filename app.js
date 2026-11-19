(function(){
var D=window.FLEET,app=document.getElementById('app');if(!D||!app)return;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rnd(seed){var s=seed;return function(){s=(s*1664525+1013904223)%4294967296;return s/4294967296}}
var COL={working:'#47d977',needs_brian:'#ffb02e',error:'#ff5a52',idle:'#7a859e',paused:'#7a859e',demo:'#5aa9ff'};
var LBL=D.labels;
var botIdx=0;

/* ---------- shared gradients (desk, wood, monitor, glass) ---------- */
var shared='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+
'<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2a574"/><stop offset="1" stop-color="#9a6e45"/></linearGradient>'+
'<linearGradient id="deskf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a30"/><stop offset="1" stop-color="#3e2a1a"/></linearGradient>'+
'<linearGradient id="mon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6580"/><stop offset="1" stop-color="#2d3347"/></linearGradient>'+
'<linearGradient id="gls" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
'<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>'+
'</defs></svg>';

function screen(st,i){
  var x=71,y=55,w=34,h=25,o='';
  var glow=COL[st];
  if(st==='working'){
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#07140f"/>';
    o+='<g class="scr1"><rect x="75" y="59" width="16" height="2.4" rx="1.2" fill="#47d977"/><rect x="75" y="64" width="24" height="2.4" rx="1.2" fill="#5ec8ff"/></g>';
    o+='<g class="scr2"><rect x="75" y="69" width="12" height="2.4" rx="1.2" fill="#ffd166"/><rect x="90" y="69" width="9" height="2.4" rx="1.2" fill="#47d977"/><rect x="75" y="74" width="18" height="2.4" rx="1.2" fill="#c792ea"/></g>';
    o+='<rect class="blk" x="95" y="74" width="3" height="3" fill="#bfffd2"/>';
  }else if(st==='needs_brian'){
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#2a1b05"/>';
    o+='<rect x="75" y="60" width="26" height="3" rx="1.5" fill="#ffb02e" opacity=".9"/><rect x="75" y="66" width="20" height="3" rx="1.5" fill="#b9791a"/><rect x="75" y="72" width="23" height="3" rx="1.5" fill="#b9791a"/>';
    o+='<circle class="led2" cx="101" cy="60" r="3.4" fill="#ff5a52"/>';
  }else if(st==='error'){
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#2b0707"/>';
    o+='<g class="blk"><path d="M88 59h4l-.8 10h-2.4z" fill="#ff5a52"/><circle cx="90" cy="73" r="2.2" fill="#ff5a52"/></g>';
  }else if(st==='paused'){
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#10131c"/>';
    o+='<rect x="82" y="60" width="5" height="15" rx="1.5" fill="#aab4cc"/><rect x="92" y="60" width="5" height="15" rx="1.5" fill="#aab4cc"/>';
  }else if(st==='demo'){
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#071426"/>';
    o+='<g fill="none" stroke="#5aa9ff" stroke-width="1.6"><circle cx="88" cy="67.5" r="9.5"/><ellipse cx="88" cy="67.5" rx="4" ry="9.5"/><path d="M78.5 67.5h19M80 62h16M80 73h16"/></g>';
  }else{
    o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="#0b0f1a"/>';
    o+='<rect x="75" y="62" width="16" height="2.2" rx="1.1" fill="#3a4560"/><rect x="75" y="67" width="24" height="2.2" rx="1.1" fill="#2f394f"/><rect x="75" y="72" width="11" height="2.2" rx="1.1" fill="#2f394f"/>';
  }
  o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="url(#gls)" opacity=".5"/>';
  return {glow:glow,svg:o};
}

function botSVG(b,i){
  var h=b.hue,st=b.state,id='b'+i;
  var c1='hsl('+h+' 92% 72%)',c2='hsl('+h+' 78% 55%)',c3='hsl('+h+' 72% 34%)',c4='hsl('+(h+20)+' 80% 82%)';
  var ih=(h+190)%360, iris1='hsl('+ih+' 70% 52%)', iris2='hsl('+ih+' 70% 24%)';
  var led=COL[st], sc=screen(st,i);
  var d=(i*0.37%4.5).toFixed(2)+'s';
  var lid=(st==='idle')?.5:(st==='paused'?1:0);
  var look=(st==='working')?'translate(2.4,1)':(st==='idle'?'translate(0,2.2)':'translate(0,0)');
  var pup=(st==='error')?2.2:3.4;
  var s='<svg class="bot" viewBox="0 0 112 112" role="img" aria-label="'+esc(b.name)+', '+esc(LBL[st])+'">';
  s+='<defs>'+
   '<radialGradient id="g'+id+'" cx="32%" cy="24%" r="85%"><stop offset="0" stop-color="'+c4+'"/><stop offset=".28" stop-color="'+c1+'"/><stop offset=".7" stop-color="'+c2+'"/><stop offset="1" stop-color="'+c3+'"/></radialGradient>'+
   '<radialGradient id="e'+id+'" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#eef3ff"/><stop offset="1" stop-color="#c9d4ee"/></radialGradient>'+
   '<radialGradient id="i'+id+'" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="'+iris1+'"/><stop offset="1" stop-color="'+iris2+'"/></radialGradient>'+
   '<clipPath id="cL'+id+'"><circle cx="30" cy="49" r="10.5"/></clipPath><clipPath id="cR'+id+'"><circle cx="51" cy="49" r="10.5"/></clipPath>'+
   '<radialGradient id="a'+id+'" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c3+'"/></radialGradient>'+
   '</defs>';
  /* monitor glow + monitor */
  s+='<rect x="69" y="52" width="38" height="31" rx="5" fill="'+sc.glow+'" opacity="'+((st==='idle'||st==='paused')?.12:.38)+'" filter="url(#soft)"/>';
  s+='<rect x="93" y="80" width="4" height="6" fill="#4a5470"/>';
  s+='<rect x="68" y="52" width="40" height="31" rx="4.5" fill="url(#mon)" stroke="#232a3d" stroke-width="1"/>';
  s+=sc.svg;
  s+='<rect x="86" y="82" width="14" height="3" rx="1.5" fill="#3a4360"/>';
  /* body */
  s+='<g class="'+(st==='needs_brian'?'hop':'breath')+'">';
  /* ground shadow under character */
  s+='<ellipse cx="40" cy="88" rx="27" ry="4" fill="#000" opacity=".22"/>';
  /* ears */
  s+='<ellipse cx="13" cy="52" rx="5.5" ry="9" fill="'+c3+'"/><ellipse cx="67" cy="52" rx="5.5" ry="9" fill="'+c3+'"/>';
  s+='<ellipse cx="13" cy="51" rx="2.4" ry="5" fill="'+c2+'"/><ellipse cx="67" cy="51" rx="2.4" ry="5" fill="'+c2+'"/>';
  /* antenna */
  s+='<path d="M40 28 Q39 20 41 14" stroke="'+c3+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  s+='<circle class="'+((st==='needs_brian'||st==='error')?'led2':'')+'" cx="41" cy="12" r="5.2" fill="'+led+'"/><circle cx="41" cy="12" r="8.5" fill="'+led+'" opacity=".25" filter="url(#soft)"/><circle cx="39.4" cy="10.2" r="1.7" fill="#fff" opacity=".85"/>';
  /* arms behind (left arm) */
  if(st==='needs_brian'){
    s+='<g class="wave"><ellipse cx="10" cy="54" rx="5.2" ry="12" fill="url(#a'+id+')" transform="rotate(-8 10 54)"/><circle cx="8" cy="41" r="6" fill="url(#a'+id+')"/><circle cx="6.4" cy="39" r="1.7" fill="#fff" opacity=".6"/></g>';
  }else{
    s+='<ellipse cx="11" cy="72" rx="5.2" ry="11" fill="url(#a'+id+')" transform="rotate(10 11 72)"/>';
  }
  /* torso/head capsule */
  s+='<rect x="14" y="27" width="52" height="64" rx="25" fill="url(#g'+id+')"/>';
  s+='<rect x="14" y="27" width="52" height="64" rx="25" fill="none" stroke="'+c3+'" stroke-opacity=".5" stroke-width="1"/>';
  /* belly highlight band + chest light */
  s+='<ellipse cx="40" cy="78" rx="17" ry="7" fill="'+c4+'" opacity=".16"/>';
  /* cheeks */
  s+='<ellipse cx="21.5" cy="62" rx="4.6" ry="3" fill="#ff7a9c" opacity=".38"/><ellipse cx="59.5" cy="62" rx="4.6" ry="3" fill="#ff7a9c" opacity=".38"/>';
  /* eyes */
  [[30,'cL'],[51,'cR']].forEach(function(e){
    var cx=e[0];
    s+='<ellipse cx="'+cx+'" cy="51" rx="11.5" ry="2.4" fill="#000" opacity=".12"/>';
    s+='<circle cx="'+cx+'" cy="49" r="10.5" fill="url(#e'+id+')" stroke="'+c3+'" stroke-opacity=".35" stroke-width=".8"/>';
    s+='<g clip-path="url(#'+e[1]+id+')"><g class="'+((st==='needs_brian'||st==='demo')?'look':'')+'" style="--d:'+d+'">';
    s+='<g style="transform:'+look.replace(/translate\(([^,]+),([^)]+)\)/,'translate($1px,$2px)')+'">';
    s+='<circle cx="'+(cx+1)+'" cy="50.5" r="6.4" fill="url(#i'+id+')"/><circle cx="'+(cx+1)+'" cy="50.5" r="'+pup+'" fill="#05070f"/>';
    s+='<circle cx="'+(cx-1.2)+'" cy="47.2" r="2.5" fill="#fff"/><circle cx="'+(cx+3.2)+'" cy="53.4" r="1.2" fill="#fff" opacity=".85"/>';
    s+='</g></g>';
    s+='<rect class="lid" style="--lid:'+lid+';--d:'+d+'" x="'+(cx-11)+'" y="38.5" width="22" height="21" fill="'+c2+'"/>';
    s+='</g>';
    if(st==='paused')s+='<path d="M'+(cx-7)+' 51 Q'+cx+' 56 '+(cx+7)+' 51" stroke="'+c3+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    if(st==='error')s+=(cx<40?'<path d="M21 39.6 L36 35.6"':'<path d="M45 35.6 L60 39.6"')+' stroke="'+c3+'" stroke-width="2.4" stroke-linecap="round"/>';
  });
  /* mouth */
  var m;
  if(st==='needs_brian')m='<ellipse cx="40.5" cy="68" rx="4" ry="4.6" fill="#4a1026"/><ellipse cx="40.5" cy="70" rx="2.6" ry="1.8" fill="#ff7a9c"/>';
  else if(st==='error')m='<path d="M33 70 Q36.5 64.5 40.5 70 T48 70" stroke="'+c3+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  else if(st==='paused')m='<path d="M37 68 h7" stroke="'+c3+'" stroke-width="2.2" stroke-linecap="round"/>';
  else if(st==='demo'||st==='working')m='<path d="M33 66 Q40.5 74 48 66" stroke="'+c3+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  else m='<path d="M35 67.5 Q40.5 71 46 67.5" stroke="'+c3+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  s+=m;
  /* gloss */
  s+='<ellipse cx="29" cy="35" rx="13" ry="5.5" fill="#fff" opacity=".42" transform="rotate(-22 29 35)"/>';
  s+='<path d="M58 40 Q64 56 58 78" stroke="#fff" stroke-opacity=".18" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(st==='demo')s+='<path d="M26 24 L40 20 L54 24" stroke="#fff" stroke-width="0" fill="none"/>';
  s+='</g>';
  /* desk */
  s+='<rect x="0" y="84" width="112" height="9" rx="3" fill="url(#wood)"/><rect x="2" y="93" width="108" height="19" fill="url(#deskf)"/><rect x="2" y="93" width="108" height="3" fill="#000" opacity=".25"/>';
  s+='<rect x="14" y="99" width="30" height="9" rx="2" fill="#000" opacity=".16"/><circle cx="29" cy="103.5" r="1.6" fill="#d8c3a2"/>';
  /* keyboard + hands */
  s+='<rect x="30" y="81.5" width="30" height="4.5" rx="2" fill="#2a3144"/><rect x="31.5" y="82.4" width="27" height="1.2" fill="#586282"/>';
  if(st==='working'){
    s+='<g class="typeL"><ellipse cx="36" cy="80" rx="5.6" ry="4.6" fill="url(#a'+id+')"/></g><g class="typeR"><ellipse cx="53" cy="80" rx="5.6" ry="4.6" fill="url(#a'+id+')"/></g>';
  }else if(st==='needs_brian'){
    s+='<ellipse cx="53" cy="80.5" rx="5.6" ry="4.6" fill="url(#a'+id+')"/>';
  }else{
    s+='<ellipse cx="36" cy="80.8" rx="5.6" ry="4.4" fill="url(#a'+id+')"/><ellipse cx="53" cy="80.8" rx="5.6" ry="4.4" fill="url(#a'+id+')"/>';
  }
  /* mug */
  s+='<rect x="2" y="76" width="9" height="9" rx="2" fill="#f2f5ff"/><path d="M11 78 q4 0 0 5" stroke="#f2f5ff" stroke-width="1.6" fill="none"/><rect x="3" y="77.5" width="7" height="2" fill="'+c2+'"/>';
  /* bubbles / status props */
  if(st==='needs_brian')s+='<g class="bub"><path d="M72 6h30a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H88l-6 6 1-6h-11a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z" fill="#fff6dd" stroke="#ffb02e" stroke-width="1.5"/><text x="87" y="23" text-anchor="middle" font-size="15" font-weight="800" fill="#c47a00" font-family="system-ui,sans-serif">?</text></g>';
  if(st==='error')s+='<g class="bub blk"><path d="M72 6h30a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H88l-6 6 1-6h-11a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z" fill="#ffe3e0" stroke="#ff5a52" stroke-width="1.5"/><text x="87" y="23" text-anchor="middle" font-size="15" font-weight="800" fill="#d6322b" font-family="system-ui,sans-serif">!</text></g>';
  if(st==='idle')s+='<text class="zz" x="56" y="22" font-size="12" font-weight="800" fill="#cfd8f5" font-family="system-ui,sans-serif">z</text><text class="zz zz2" x="64" y="14" font-size="9" font-weight="800" fill="#cfd8f5" font-family="system-ui,sans-serif">z</text>';
  if(st==='paused')s+='<g><rect x="63" y="14" width="4" height="12" rx="1.5" fill="#cfd8f5"/><rect x="70" y="14" width="4" height="12" rx="1.5" fill="#cfd8f5"/></g>';
  if(st==='demo')s+='<g><rect x="2" y="4" width="34" height="13" rx="6.5" fill="#5aa9ff"/><text x="19" y="13.6" text-anchor="middle" font-size="8.5" font-weight="800" fill="#06223f" font-family="system-ui,sans-serif">DEMO</text></g>';
  s+='</svg>';
  return s;
}

/* ---------- page ---------- */
var bots=D.bots, byTeam={};
bots.forEach(function(b){(byTeam[b.team]=byTeam[b.team]||[]).push(b)});
var cnt={working:0,needs_brian:0,error:0,idle:0};
bots.forEach(function(b){cnt[(b.state==='idle'||b.state==='paused'||b.state==='demo')?'idle':b.state]++});
var h=shared+'<div class="sky" id="sky"></div><div class="wrap">';
h+='<header class="top"><h1>Fleet Office<small>Updated '+esc(D.updated)+'</small></h1><div class="chips">'+
 '<span class="chip"><i style="background:#47d977"></i>'+cnt.working+' working</span>'+
 '<span class="chip"><i style="background:#ffb02e"></i>'+cnt.needs_brian+' need the owner</span>'+
 '<span class="chip"><i style="background:#ff5a52"></i>'+cnt.error+' stuck</span>'+
 '<span class="chip"><i style="background:#7a859e"></i>'+cnt.idle+' idle</span></div></header>';
h+='<div class="tower"><div class="roof"><div class="tank"></div><div class="sign">FLEET HQ</div><div class="ant"></div><div class="par"></div></div><div class="body"><div class="shaft"><div class="cab"></div></div>';
var ri=0,gi=0,floorsTotal=D.floors.length;
D.floors.forEach(function(f,fi){
  h+='<section class="floor"><span class="fl-tag">'+(floorsTotal-fi)+'F</span>';
  f.rooms.forEach(function(r){
    var list=byTeam[r.team]||[];
    h+='<div class="room r'+(ri%6)+'" style="flex-grow:'+Math.max(1,Math.min(list.length,6))+'"><h2>'+esc(r.label)+'<small>'+list.length+'</small></h2><div class="desks">';
    list.forEach(function(b){
      var i=gi++;
      h+='<button type="button" class="t s-'+b.state+(b.src==='live'?'':' rec')+'" data-i="'+bots.indexOf(b)+'">'+botSVG(b,i)+'<span class="np"><i class="led"></i><span>'+esc(b.name)+'</span></span></button>';
    });
    h+='</div></div>';ri++;
  });
  h+='</section>';
});
h+='</div><div class="lobby"><div class="plant" style="left:12%"></div><div class="awn"></div><div class="door"></div><div class="plant" style="right:12%"></div></div><div class="street"><div class="car"></div></div></div>';
var need=bots.filter(function(b){return b.state==='needs_brian'||b.state==='error'});
h+='<section class="need"><h2>Needs the owner</h2>';
if(!need.length)h+='<div class="card"><div>Nothing needs attention right now.</div></div>';
need.forEach(function(b){
  h+='<div class="card s-'+b.state+'"><span class="ic">'+botSVG(b,500+bots.indexOf(b)).replace('<svg class="bot" viewBox="0 0 112 112"','<svg class="bot" viewBox="2 6 70 70" style="width:46px;height:46px;overflow:hidden"')+'</span><div><b>'+esc(b.name)+'</b><em>'+esc(LBL[b.state])+'</em><br>'+esc(b.task)+'</div></div>';
});
h+='</section><div class="foot">'+D.live_count+' of '+D.total+' bots have a live report; dashed nameplates show what the bot’s records said earlier. Times are CST with PST in parentheses. Tap a desk for details.</div></div><div id="tip" role="status"></div>';
app.innerHTML=h;

/* sky: stars, clouds, skyline */
(function(){
  var sky=document.getElementById('sky'),r=rnd(7),o='';
  for(var i=0;i<90;i++)o+='<i class="star" style="left:'+(r()*100).toFixed(1)+'%;top:'+(r()*60).toFixed(1)+'%;animation-delay:'+(r()*3).toFixed(1)+'s;opacity:'+(.3+r()*.6).toFixed(2)+'"></i>';
  o+='<div class="moon"></div>';
  for(var c=0;c<4;c++)o+='<div class="cloud" style="top:'+(90+c*70)+'px;width:'+(110+r()*90|0)+'px;animation-duration:'+(110+c*30)+'s;animation-delay:-'+(c*37)+'s"></div>';
  var sk='<svg class="skyline" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><g>';
  var x=0;while(x<1200){var w=34+r()*60,hh=70+r()*190,col=r()>.5?'#141c3e':'#101733';
    sk+='<rect x="'+x.toFixed(0)+'" y="'+(300-hh).toFixed(0)+'" width="'+w.toFixed(0)+'" height="'+hh.toFixed(0)+'" fill="'+col+'"/>';
    for(var wy=300-hh+10;wy<290;wy+=14)for(var wx=x+6;wx<x+w-8;wx+=11)if(r()>.72)sk+='<rect x="'+wx.toFixed(0)+'" y="'+wy.toFixed(0)+'" width="4" height="6" fill="#ffe9a0" opacity="'+(.3+r()*.6).toFixed(2)+'"/>';
    x+=w+r()*6;}
  sk+='</g></svg>';
  sky.innerHTML=o+sk;
})();

/* details */
var tip=document.getElementById('tip'),on=null;
function show(t){
  if(on)on.classList.remove('on');on=t;t.classList.add('on');
  var b=bots[+t.getAttribute('data-i')];
  tip.style.setProperty('--sc',COL[b.state]);
  tip.innerHTML='<b>'+esc(b.name)+'</b> · '+esc(LBL[b.state])+'<br>'+esc(b.task)+'<small>'+esc(b.when)+' · '+(b.src==='live'?'live report':'from records')+'</small>';
  tip.style.display='block';
}
function hide(){tip.style.display='none';if(on)on.classList.remove('on');on=null}
function tile(e){return e.target.closest&&e.target.closest('.t')}
document.addEventListener('click',function(e){var t=tile(e);if(t)show(t);else hide()});
document.addEventListener('mouseover',function(e){var t=tile(e);if(t&&t!==on)show(t)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
})();
