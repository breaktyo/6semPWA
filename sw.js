const cacheName = 'piac-pwa-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/main.js',
  '/gallery.html',
  '/about.html',
  
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {return cache.addAll(filesToCache);})
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        if (event.request.method === 'GET') {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push Received:', data);

  const options = {
    body: data.body,
    icon: 'images\manifest-icon-192.maskable.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
