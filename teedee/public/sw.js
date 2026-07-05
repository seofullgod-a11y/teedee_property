/* อยู่ใจ service worker — app shell caching + offline fallback */
const CACHE = 'yoojai-v1';
const SHELL = ['/', '/manifest.json', '/img/icon-192.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // API: network-only (always fresh, never cache)
  if (url.pathname.startsWith('/api/')) return;

  // Page navigations: network-first, fall back to cached shell when offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match(req).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Static assets (css/js/img — versioned via ?v=): cache-first, then cache the result
  if (/\/(css|js|img)\//.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => cached))
    );
  }
});
