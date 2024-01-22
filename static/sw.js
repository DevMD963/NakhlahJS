const CACHE_NAME = 'cache-' + Math.floor(Math.random() * 1000000);
self.addEventListener('install', async function(event) {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
        })
    );
    const resp = await fetch('/sw-cache.json');
    const FILES_TO_CACHE = await resp.json();
    console.log('Installing Service Worker...');
    console.log('Caching Files...');
    console.log(FILES_TO_CACHE.join('\n'));
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});
self.addEventListener('activate', function(event) {
    
});
self.addEventListener('fetch', function(event) {
    // console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // I KNOW THIS IS NOT THE BEST WAY TO DO THIS
            if (!response) {
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.add(event.request.url);
                });
            }
            return response || fetch(event.request);
        })
    );
});