/* stats */
/* queries */
const tgt=d=>S.tg[d]??S.set.target,tot=(d,ty)=>S.ses.reduce((a,x)=>a+(x.d==d&&(!ty||x.type==ty)?x.sec:0),0),rg=(a,b,f)=>S.ses.reduce((s,x)=>s+(x.d>=a&&x.d<=b&&(!f||f(x))?x.sec:0),0);
const wk=s=>{const d=ps(s);return ad(s,-((d.getDay()-S.set.ws+7)%7))};
function streaks(){const m={};S.ses.forEach(x=>m[x.d]=(m[x.d]||0)+x.sec);const ok=d=>(m[d]||0)>=S.set.minDay*60;let c=0,d=td();if(!ok(d))d=ad(d,-1);while(ok(d)){c++;d=ad(d,-1)}let L=0,r=0,p=null;Object.keys(m).filter(ok).sort().forEach(k=>{r=p&&ad(p,1)==k?r+1:1;L=Math.max(L,r);p=k});return{c,L}}

const SC=['#22a559','#3b82f6','#eab308','#ef4444','#8b5cf6','#f97316','#14b8a6','#ec4899'],sc=s=>{if(!s)return'#c4c7cc';if(/biology/i.test(s))return'#facc15';if(/english/i.test(s))return'#ec4899';return S.subj.includes(s)?SC[S.subj.indexOf(s)%SC.length]:'#a9adb4'};
function wkChart(w){const days=[...Array(7)].map((_,i)=>ad(w,i)),W=720,H=270,L=46,B=30,T=46,ph=H-T-B,sl=(W-L-8)/7,bw=Math.min(sl*.38,46),D=days.map(d=>{const m={};S.ses.filter(x=>x.d==d).forEach(x=>m[x.sub]=(m[x.sub]||0)+x.sec);return{d,m,t:tot(d),g:tgt(d)*3600}}),mxh=Math.max(0,...D.map(x=>Math.max(x.t,x.g)))/3600,st=mxh<=16?2:4,mx=Math.max(16,Math.ceil(mxh/st)*st),Y=h=>T+ph-h/mx*ph;let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Study hours this week">`;let lab='',P=[];
for(let h=0;h<=mx;h+=st)s+=`<line x1="${L}" x2="${W-8}" y1="${Y(h)}" y2="${Y(h)}" stroke="#e8e9ec"/><text x="${L-8}" y="${Y(h)+4}" text-anchor="end">${h}h</text>`;
D.forEach((x,i)=>{const cx=L+sl*i+sl/2;s+=`<defs><clipPath id="weekbar${i}" clipPathUnits="userSpaceOnUse"><rect x="${cx-bw/2}" y="${T+ph-(x.t/3600)/mx*ph}" width="${bw}" height="${(x.t/3600)/mx*ph}" rx="4"/></clipPath></defs>`;let y0=0;Object.entries(x.m).sort((a,b)=>S.subj.indexOf(a[0])-S.subj.indexOf(b[0])).forEach(([sb,v])=>{const h=v/3600/mx*ph;s+=`<rect x="${cx-bw/2}" y="${T+ph-y0-h}" width="${bw}" height="${h}" fill="${sc(sb)}" clip-path="url(#weekbar${i})"><title>${esc(sb||'No subject')}: ${fd(v)}</title></rect>`;y0+=h});if(x.d<=td())P.push({cx,y:Y(x.t/3600)-28,m:Math.round(x.t/60)});if(x.t)lab+=`<text x="${cx}" y="${T+ph-y0-6}" text-anchor="middle" style="fill:#111;font-weight:600;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">${fd(x.t)}</text>`;/* target: a thin black line touching the right edge of the bar, from 0h up to the target */
if(x.g)s+=`<rect x="${cx+bw/2}" y="${Y(x.g/3600)}" width="1.8" height="${Y(0)-Y(x.g/3600)}" fill="#111"/>`;s+=`<text x="${cx}" y="${H-10}" text-anchor="middle">${DN[ps(x.d).getDay()].slice(0,3)}</text>`});
/* trend line above the bars: green = more than the day before, red = less, black = same */
for(let i=1;i<P.length;i++){
  const a=P[i-1],b=P[i],c=b.m>a.m?'#15803d':b.m<a.m?'#dc2626':'#111';
  s+=`<line x1="${a.cx}" y1="${a.y}" x2="${b.cx}" y2="${b.y}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
}
P.forEach(p=>s+=`<circle cx="${p.cx}" cy="${p.y}" r="3.2" fill="#fff" stroke="#111" stroke-width="1.8"/>`);
return s+lab+'</svg>'}
const wl=s=>{const a=ps(s),b=ps(ad(s,6)),m=x=>x.toLocaleDateString('en-GB',{month:'short'});return a.getMonth()==b.getMonth()?a.getDate()+'–'+b.getDate()+' '+m(b):a.getDate()+' '+m(a)+'–'+b.getDate()+' '+m(b)};
