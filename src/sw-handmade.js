var version = '1'
var cacheName = 'pwatter-v' + version

var appShellFilesToCache = [
  './',
  './index.html',
  './inline.bundle.js',
  './main.bundle.js',
  './polyfills.bundle.js',
  './styles.bundle.css',
  './vendor.bundle.js',
  './favicon.ico',
  './assets/images/logo.png'
]

var dataCacheName = 'pwatter-runtime-v' + version

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
  console.log('[SW] Installed')

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[SW] Caching App Shell')
      return cache.addAll(appShellFilesToCache)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  console.log('[SW] Active')

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {

        if (key !== cacheName) {
          console.log('[SW] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetch')

  // Match requests for data and handle them separately
  if (event.request.url.indexOf('/timeline') != -1) {
    event.respondWith(

      // Network-First Strategy
      fetch(event.request)
        .then((response) => {
          return caches.open(dataCacheName).then((cache) => {

            cache.put(event.request.url, response.clone())
            console.log('[SW] Fetched & Cached URL using network-first', event.request.url)
            return response.clone()
          })
        })
        .catch((error) => {
          console.log('[SW] Returning from cache', event.request.url)
          return caches.match(event.request).then((response) => {
            return response
          })
        })

    )
  } else if (event.request.url.indexOf('fonts.googleapis.com') != -1 || event.request.url.indexOf('fonts.gstatic.com') != -1 || event.request.url.indexOf('pbs.twimg.com') != -1) {
    event.respondWith(

      // Cache-First Strategy
      caches.match(event.request.clone()).then((response) => {
        return response || fetch(event.request.clone()).then((r2) => {
            return caches.open(dataCacheName).then((cache) => {
              console.log('[SW] Fetched & Cached URL using cache-first', event.request.url)
              cache.put(event.request.url, r2.clone())
              return r2.clone()
            })
          })
      })

    )
  } else {

    // The old code for App Shell
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  }
})
