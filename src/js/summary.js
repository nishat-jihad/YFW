/* Today summary: shows today's date, net study time and the subjects studied, and saves it as a PNG picture.
   The picture is drawn on a canvas, so it works offline and needs no extra library. */
const SM={
L(){return S.set.lang=='bn'?{h:'আজকের সামারি',app:'Your Future',tot:'মোট পড়ার সময়',sub:'আজ যা যা পড়েছি',none:'আজ এখনো কোনো পড়া রেকর্ড হয়নি',ns:'বিষয় ছাড়া',ok:'স্ক্রিনশট সেভ হয়েছে'}:{h:'Today summary',app:'Your Future',tot:'Net study time',sub:'Subjects studied',none:'No study recorded today yet',ns:'No subject',ok:'Screenshot saved'}},
data(){const t=td(),m={};S.ses.filter(x=>x.d==t).forEach(x=>m[x.sub||'']=(m[x.sub||'']||0)+x.sec);return{d:t,tot:tot(t),l:Object.entries(m).filter(a=>a[1]>0).sort((a,b)=>b[1]-a[1])}},
async draw(c){
const L=SM.L(),D=SM.data(),F='"Noto Sans Bengali","Segoe UI",Arial,sans-serif',W=1080,P=64,RH=96,n=Math.max(1,D.l.length),H=500+n*RH+30;
try{await Promise.all([document.fonts.load('400 30px "Noto Sans Bengali"'),document.fonts.load('600 30px "Noto Sans Bengali"'),document.fonts.load('700 30px "Noto Sans Bengali"')])}catch(e){}
c.dataset.d=D.d;c.width=W;c.height=H;const x=c.getContext('2d');
const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
const tx2=(s,a,b,sz,wt,col,al)=>{x.font=wt+' '+sz+'px '+F;x.fillStyle=col;x.textAlign=al||'left';x.textBaseline='alphabetic';x.fillText(s,a,b)};
const fit=(s,max,sz,wt)=>{x.font=wt+' '+sz+'px '+F;if(x.measureText(s).width<=max)return s;while(s.length>1&&x.measureText(s+'…').width>max)s=s.slice(0,-1);return s+'…'};
x.fillStyle='#fff';x.fillRect(0,0,W,H);x.fillStyle='#1d4ed8';x.fillRect(0,0,W,14);
tx2(L.app,P,92,30,600,'#6b7078');
tx2(dl2(D.d),P,160,44,700,'#111');
x.fillStyle='#e8e9ec';x.fillRect(P,196,W-P*2,2);
tx2(L.tot,P,262,28,500,'#6b7078');
tx2(fd(D.tot),P,372,120,700,'#111');
x.fillStyle='#e8e9ec';x.fillRect(P,414,W-P*2,2);
tx2(L.sub,P,470,28,500,'#6b7078');
if(!D.l.length)tx2(L.none,P,470+64,34,500,'#6b7078');
D.l.forEach((r,i)=>{const y=500+i*RH,nm=r[0]||L.ns,tm=fd(r[1]);x.font='600 36px '+F;const tw=x.measureText(tm).width;
tx2(fit(nm,W-P*2-tw-30,36,600),P,y+40,36,600,'#111');tx2(tm,W-P,y+40,36,600,'#111','right');
const bw=W-P*2;x.fillStyle='#e8e9ec';rr(P,y+56,bw,16,8);x.fill();x.fillStyle=sc(r[0]);rr(P,y+56,Math.max(16,bw*r[1]/D.tot),16,8);x.fill()});
},
async open(){const L=SM.L();$('#M').innerHTML=`<div class=mb style="max-width:440px"><h3>${L.h}</h3><canvas id=smc style="width:100%;height:auto;display:block;border:1px solid var(--b);border-radius:8px"></canvas><div class=row style="margin-top:14px;justify-content:flex-end"><button onclick=closeM()>Close</button><button class=p id=smss>Screenshot</button></div></div>`;$('#M').hidden=false;await SM.draw($('#smc'));const b=$('#smss');if(b)b.onclick=SM.save},
save(){const c=$('#smc');if(!c)return;const d=c.dataset.d||td();c.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='Study-Summary-'+d+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast(SM.L().ok)},'image/png')}
};
