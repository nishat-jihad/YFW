/* app */
/* full-screen timer */
function fsr(){const f=$('#FS'),dk=S.set.theme=='dark';if(f.style.display!='flex')return;f.className=dk?'dk':'';f.innerHTML=`<div class="big tdig">${clk(disp())}</div>`}
function render(){if(!V[R])R='home';$('#main').innerHTML=(R!='home'?'<button class=bk onclick=A.back()>‹ Back</button>':'')+V[R]();document.querySelectorAll('[data-r]').forEach(b=>b.classList.toggle('on',b.dataset.r==R));const c=$('#jc');if(c)c.oninput=()=>cv=c.value;i18n($('#main'));lgBtn()}
addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h&&h!=R&&V[h]){R=h;render()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();fsr()}});
function lgBtn(){let b=$('#lg');if(!b){b=document.createElement('button');b.id='lg';b.className='lg';b.onclick=()=>A.lang();document.body.appendChild(b)}b.textContent=S.set.lang=='bn'?'English':'বাংলা'}
function regSW(){if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{})}
function gapCheck(){const t=T();if(!t.run||!t.hb)return;const g=Date.now()-t.hb;if(g<12e4)return;gapAsk=1;$('#M').innerHTML='<div class=mb><p>The timer was running while the app was closed or the device was off for about '+fd(g/1000)+'. Keep counting that time?</p><div class=row><button class=d id=gx>No, remove it</button><button class=p id=gk>Yes, keep it</button></div></div>';$('#M').hidden=false;i18n($('#M'));$('#gk').onclick=()=>{t.hb=Date.now();gapAsk=0;save();closeM()};$('#gx').onclick=()=>{t.acc+=Math.max(0,t.hb-t.t0);t.t0=Date.now();t.hb=Date.now();gapAsk=0;save();closeM();render()}}
load().then(()=>{build();applyNav();render();ready=1;gapCheck();regSW();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}});
