/* state */
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),ps=s=>{const a=s.split('-');return new Date(+a[0],a[1]-1,+a[2])},ad=(s,n)=>{const d=ps(s);d.setDate(d.getDate()+n);return ymd(d)},td=()=>ymd(new Date());
const uid=()=>{const a=new Uint8Array(16);crypto.getRandomValues(a);return[...a].map(x=>x.toString(16).padStart(2,'0')).join('')};
const fd=s=>{s=Math.round(s);if(s<=0)return'0m';if(s<60)return s+'s';const m=Math.round(s/60),h=Math.floor(m/60);return h?h+'h'+(m%60?' '+m%60+'m':''):m+'m'},clk=s=>{s=Math.max(0,Math.floor(s));return pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60)};
const DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],pc=(a,b)=>b>0?Math.round(a/b*100):0;
const def=()=>({v:1,dev:uid(),set:{name:'',target:6,minDay:60,lang:'en',ws:6,nav:'side',pf:25,pb:5,theme:'light',snd:true,bk:14,last:null},tg:{},tasks:[],ses:[],lock:{},rt:[],ex:[],subj:['Physics','Chemistry','Higher Mathematics','Biology'],tm:{mode:'self',run:0,t0:0,s0:0,acc:0,sub:'',top:'',ph:'w',cnt:0,hb:0},ch:null,hist:[]});
let sw=0,ready=0,gapAsk=0,hist=0,S=def(),R=location.hash.slice(1)||'home',sel=td(),rd=0,sd=0,cd=null,ctab='c',cv='',conn='Disconnected',pcn,dc;

const fmt12=t=>{const a=t.split(':');return((a[0]%12)||12)+':'+a[1]+' '+(a[0]<12?'AM':'PM')};
