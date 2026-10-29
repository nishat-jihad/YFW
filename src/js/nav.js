/* nav */
/* views */
const NAV=[['home','Home','⌂'],['tracker','Daily Tracker','▣'],['timer','Study Timer','<i class=ict></i>'],['routine','Weekly Routine','<i class=ric></i>'],['stats','Statistics','▥'],['exams','Exams','✎'],['settings','Settings','<i class=ics></i>']],BN={home:'হোম',tracker:'ট্র্যাকার',timer:'টাইমার',routine:'রুটিন',stats:'পরিসংখ্যান',exams:'পরীক্ষা',settings:'সেটিংস'};
const nl=(k,e)=>e;
function build(){$('#nv').innerHTML=NAV.map(n=>`<button class=nv data-r=${n[0]} onclick="A.go('${n[0]}')"><span>${n[2]}</span>${nl(n[0],n[1])}</button>`).join('');const m=['home','tracker','timer','stats'];$('#bot').innerHTML=NAV.map(n=>`<button class="nv${m.includes(n[0])?'':' x'}" data-r=${n[0]} onclick="A.go('${n[0]}')"><span>${n[2]}</span>${nl(n[0],n[1].replace('Daily ','').replace('Study ','').replace('Weekly ',''))}</button>`).join('')+`<button class="nv mo" onclick="more()"><span>☰</span>More</button>`}
const applyNav=()=>document.body.classList.toggle('nb',S.set.nav=='bottom');
function more(){$('#M').innerHTML=`<div class=mb><h3>More</h3>${NAV.filter(n=>!['home','tracker','timer','stats'].includes(n[0])).map(n=>`<button class=nv onclick="A.go('${n[0]}')"><span>${n[2]}</span>${nl(n[0],n[1])}</button>`).join('')}<br><button onclick=closeM()>Close</button></div>`;$('#M').hidden=false}
const dur=(s,e)=>{const f=x=>x.split(':')[0]*60+ +x.split(':')[1];return((f(e)-f(s)+1440)%1440)*60},dl2=d=>ps(d).toLocaleDateString(S.set.lang=='bn'?'bn-BD':'en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
