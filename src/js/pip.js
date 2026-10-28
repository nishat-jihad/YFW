/* pip */
/* Floating timer: use a resizable Document Picture-in-Picture window when available. */
let pipC,pipV,pipWin,pipDocTimer;
function pipDraw(){
 const t=T(),time=clk(disp()),label=(t.mode=='pomo'?(t.ph=='w'?'Focus':'Break'):t.mode=='class'?'Class':'Self study')+(t.run?' · running':t.acc?' · paused':'');
 if(pipC){const x=pipC.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,480,270);x.fillStyle='#111';x.textAlign='center';x.font='bold 88px monospace';x.fillText(time,240,140);x.font='22px sans-serif';x.fillStyle='#6b7078';x.fillText(label,240,195)}
 if(pipWin&&!pipWin.closed){const tm=pipWin.document.getElementById('pip-time'),st=pipWin.document.getElementById('pip-state');if(tm)tm.textContent=time;if(st)st.textContent=label}
}
setInterval(()=>{if((pipC&&document.pictureInPictureElement)||(pipWin&&!pipWin.closed))pipDraw()},500);
A.pip=async()=>{
 try{
  if(pipWin&&!pipWin.closed){pipWin.close();pipWin=null;return}
  if(document.pictureInPictureElement){await document.exitPictureInPicture();return}
  if(document.pictureInPictureEnabled&&HTMLCanvasElement.prototype.captureStream){
   if('documentPictureInPicture' in window){
    pipWin=await window.documentPictureInPicture.requestWindow({width:480,height:270});
    pipWin.document.title='Study Timer';
    pipWin.document.body.style.cssText='margin:0;background:#fff;color:#111;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-width:220px;min-height:130px;overflow:hidden;';
    pipWin.document.body.innerHTML='<div id="pip-time" style="font:700 clamp(28px,16vw,64px) ui-monospace,monospace;font-variant-numeric:tabular-nums;white-space:nowrap">00:00</div><div id="pip-state" style="font-size:14px;color:#6b7078;text-align:center">Study Timer</div><div style="font-size:11px;color:#9ca3af">Resize this window from its edges</div>';
    pipWin.addEventListener('pagehide',()=>{pipWin=null});pipDraw();return;
   }
   pipC=pipC||Object.assign(document.createElement('canvas'),{width:480,height:270});pipDraw();pipV=pipV||document.createElement('video');pipV.muted=true;pipV.srcObject=pipC.captureStream(5);await pipV.play();await pipV.requestPictureInPicture();return;
  }
  throw 0;
 }catch(e){toast('Picture-in-picture is not supported in this browser or device')}
};
