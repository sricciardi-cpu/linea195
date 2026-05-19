// Service Worker — network-first para HTML/JSON, cache-first para assets estáticos
const CACHE = 'linea195-v3';

self.addEventListener('install', e => {
  // Activate this SW immediately, skipping the waiting phase
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // Wipe ALL old caches
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();

    // Tell all open tabs to reload so they pick up the new version
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for HTML, JSON, and manifest — always try fresh
  const isFresh = e.request.mode === 'navigate' ||
                  url.pathname.endsWith('.json') ||
                  url.pathname.endsWith('.html') ||
                  url.pathname === '/';

  if (isFresh) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          // Cache the fresh response for offline fallback
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('/')))
    );
    return;
  }

  // Cache-first for everything else (static assets)
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => cached)
    )
  );
});
