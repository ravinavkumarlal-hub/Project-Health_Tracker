// service-worker.js

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('health-tracker-cache').then((cache) => {
            return cache.addAll([
                // List of files to cache
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/images/logo.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
