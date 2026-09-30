// İnternetsiz oynamak için önbellek. Oyunu güncelleyince SURUM'u artır.
const SURUM = 'islama-v1';
const DOSYALAR = ['./', 'index.html', 'manifest.webmanifest', 'ikonlar/ikon-192.png', 'ikonlar/ikon-512.png', 'ikonlar/apple-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { caches.open(SURUM).then(c => c.put('index.html', r.clone())); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(h => h || fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const k = r.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); }
    return r;
  })));
});
