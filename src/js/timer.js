/* timer */
/* timer engine (timestamp based) */
const T=()=>S.tm,el=()=>T().acc+(T().run?Date.now()-T().t0:0),plen=()=>(T().ph=='w'?S.set.pf:S.set.pb)*60000,disp=()=>T().mode=='pomo'?(plen()-el())/1000:el()/1000;
function beep(){if(!S.set.snd)return;try{const a=new AudioContext(),o=a.createOscillator();o.connect(a.destination);o.frequency.value=880;o.start();o.stop(a.currentTime+.4)}catch(e){}}
function saveSes(sec,type){if(sec<1)return 0;const st=T().s0||Date.now()-sec*1000,d=ymd(new Date(st));if(S.lock[d]){toast('That day is locked, so the session cannot be saved there.');return 0}S.ses.push({id:uid(),st,en:Date.now(),sec:Math.round(sec),sub:T().sub,top:T().top,type,d,src:'timer'});save();return 1}
setInterval(()=>{if(!ready||gapAsk)return;const t=T();if(t.run&&Date.now()-(t.hb||0)>5000){t.hb=Date.now();save()}if(t.run&&t.mode=='pomo'&&el()>=plen()){if(t.ph=='w'){saveSes(S.set.pf*60,'self');t.cnt++}t.ph=t.ph=='w'?'b':'w';t.acc=0;t.t0=Date.now();t.s0=Date.now();beep();save();if(R=='timer')render();fsr()}document.querySelectorAll('.tdig').forEach(e=>e.textContent=clk(disp()))},250);
