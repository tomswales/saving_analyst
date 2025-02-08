"use strict"

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open("saving_analyst").then(function(cache) {
        return cache.addAll(
          [
            './',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/webfonts/fa-regular-400.woff2',
            './styles.css',
            'https://unpkg.com/purecss@1.0.0/build/pure-min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css',
            'https://fonts.googleapis.com/css?family=PT+Sans'
          ]
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });