/* Offline support: caches the app files so it opens without internet or after a power cut.
   Study data is not stored here; it lives in IndexedDB. Bump CACHE when you upload a new version. */
const CACHE='yf-v6',FILES=['./','index.html','src/css/styles.css','src/css/icons.css','sw.js'].concat(['state','legacy','i18n','storage','components','stats','ayah','timer','actions','pip','nav','views','app'].map(n=>'src/js/'+n+'.js'));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;e.respondWith(fetch(r).then(res=>{const u=new URL(r.url);if((res.ok||res.type==='opaque')&&(u.origin===location.origin||u.hostname==='cdnjs.cloudflare.com'||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
