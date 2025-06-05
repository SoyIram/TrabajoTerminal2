// Nombre del cache y archivos locales que queremos guardar
const CACHE_NAME = 'v1_grupo_lehren';
const urlsToCache = [
  './',
  './index.html',
  './?utm_source=web_app_manifest',
  './css/styles.css',
  './script.js',
  './img/icon-192x192.png',
  './img/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cacheamos archivos ignorando errores individuales
      return Promise.allSettled(
        urlsToCache.map((url) => cache.add(url))
      );
    }).then(() => self.skipWaiting())
      .catch((err) => console.error('Falló registro de cache', err))
  );
});

// Activación del SW y limpieza de caches viejos
self.addEventListener('activate', (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta las peticiones
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // 🔒 Ignora peticiones externas como FontAwesome
  if (url.startsWith('https://kit.fontawesome.com/')) return;

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    }).catch(() => {
      // Aquí puedes devolver una página de error offline si quieres
    })
  );
});
