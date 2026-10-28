/* storage */
/* storage: IndexedDB, localStorage fallback */
const idb=()=>new Promise((y,n)=>{const r=indexedDB.open('yf',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>y(r.result);r.onerror=()=>n(r.error)});
let sv=0;function save(){clearTimeout(sv);sv=setTimeout(async()=>{try{const d=await idb();d.transaction('kv','readwrite').objectStore('kv').put(JSON.stringify(S),'s')}catch(e){try{localStorage.setItem('yf',JSON.stringify(S))}catch(x){toast('Storage full or blocked: export a backup now')}}},60)}
async function load(){try{const d=await idb();const v=await new Promise((y,n)=>{const q=d.transaction('kv').objectStore('kv').get('s');q.onsuccess=()=>y(q.result);q.onerror=n});if(v)S=Object.assign(def(),JSON.parse(v))}catch(e){try{const v=localStorage.getItem('yf');if(v)S=Object.assign(def(),JSON.parse(v))}catch(x){}}S.set=Object.assign(def().set,S.set);S.tm=Object.assign(def().tm,S.tm)}
