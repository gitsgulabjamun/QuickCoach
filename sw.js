// Quick Coach v3 – service worker
const CACHE = "qc-cache-v3";
const ASSETS = ["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",(e)=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",(e)=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k))))) });
self.addEventListener("fetch",(e)=>{const u=new URL(e.request.url); if(u.origin===location.origin){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));}});
