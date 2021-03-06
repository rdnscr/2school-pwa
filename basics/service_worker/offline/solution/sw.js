// event handler to install the service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/image-list.js',
        '/star-wars-logo.jpg',
        '/gallery/bountyHunters.jpg',
        '/gallery/myLittleVader.jpg',
        '/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

// event handler for fetch requests
self.addEventListener('fetch', function(event) {
  if (!(event.request.url.indexOf('http') === 0)) {
    //skip request (could be some extension request we don't want and can't handle)
    return; 
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone();

            caches.open('v1').then(function(cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function() {
            return caches.match('/gallery/myLittleVader.jpg');
          });
      }
    })
  );
});
