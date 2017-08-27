var version = '1'
var cacheName = 'pwatter-v' + version
var dataCacheName = 'pwatter-runtime-v' + version

self.addEventListener('install', (event) => {

  event.waitUntil(self.skipWaiting())
  console.log('[SW] Installed')

})

self.addEventListener('activate', (event) => {

  event.waitUntil(self.clients.claim())
  console.log('[SW] Active')

})

self.addEventListener('fetch', (event) => {

  console.log('[SW] Fetch')

})
