// event handler to install the service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v3').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/image-list.js',
        '/star-wars-logo.jpg',
        '/gallery/bountyHunters.jpg',
        '/gallery/myLittleVader.jpg',
        '/gallery/snowTroopers.jpg',
        '/assets/images/icon-72x72.png',                
        '/assets/images/icon-96x96.png',                
        '/assets/images/icon-144x144.png',                
        '/assets/images/icon-192x192.png'                
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
  
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v3').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/gallery/myLittleVader.jpg');
      });
    }
  }));
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v3'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// TODO handle post message to skipWaiting and make the service worker active
