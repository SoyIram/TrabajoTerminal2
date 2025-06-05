// Asignar un nombre y versión al caché
const CACHE_NAME = 'v1_grupo_lehren';
const urlsToCache = [
  'index.html',
  'css/styles.css',
  'script.js',
  'img/icon-192x192.png',
  'img/icon-512x512.png'
];

// Durante la instalación, se cachean los recursos estáticos del mismo origen
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Filtramos solo los recursos del mismo origen
        const cacheableUrls = urlsToCache.filter(url => {
          const fullUrl = new URL(url, self.location.origin);
          return fullUrl.origin === self.location.origin;
        });
        return cache.addAll(cacheableUrls);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('Falló registro de cache', err))
  );
});

// Activación del SW y limpieza de cachés viejos
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Interceptar las peticiones y responder desde caché o red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );
});
