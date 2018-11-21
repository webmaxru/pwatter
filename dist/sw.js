// Let's have it locally. Run "workbox copyLibraries dist"
importScripts('workbox-v3.6.3/workbox-sw.js')

// SETTINGS

// Use local version of Workbox libraries
workbox.setConfig({modulePathPrefix: 'workbox-v3.6.3/'})

// Verbose logging even for the production
workbox.setConfig({ debug: true })
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// Modify SW update cycle
workbox.skipWaiting()
workbox.clientsClaim()

// PRECACHING

// We inject manifest here using "workbox-build" in workbox-build-inject.js
workbox.precaching.precacheAndRoute([
  {
    "url": "3rdpartylicenses.txt",
    "revision": "3110f4db026710261a0b58c2cca7e377"
  },
  {
    "url": "assets/config/config.dev.json",
    "revision": "505613c558bcb6873363959bf3bcbad2"
  },
  {
    "url": "assets/config/config.prod.json",
    "revision": "01b9150d5c99b1b7198fe972e3de7c58"
  },
  {
    "url": "assets/config/new-service-config.json",
    "revision": "33e75c4ec8d559bfc69d236d8bc3709b"
  },
  {
    "url": "assets/images/logo.png",
    "revision": "7476b3901cd882488fddd28653b3fc15"
  },
  {
    "url": "favicon.ico",
    "revision": "4f6a4dab3f3cae2985be59bfd9909605"
  },
  {
    "url": "index.html",
    "revision": "56569a8daa175e0fef6ecd783e1e952d"
  },
  {
    "url": "inline.318b50c57b4eba3d437b.bundle.js",
    "revision": "6eaa1608803b51f7d836604d9585670d"
  },
  {
    "url": "main.7da618cf86c4f3b7ce69.bundle.js",
    "revision": "eb4a598f03c90b6255e4294ad89d97a6"
  },
  {
    "url": "polyfills.7d45653c6826e2fefc7d.bundle.js",
    "revision": "c32f442a0c1333c90ff323ff1a3cebb7"
  },
  {
    "url": "styles.b3f30bba4ac11acb8bbb.bundle.css",
    "revision": "d4c9d7710d7be30d203e0538c3fa1d5e"
  }
])

// RUNTIME CACHING

// Google fonts
workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30
      })
    ]
  })
)

// API with network-first strategy
workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)timeline/,
  workbox.strategies.networkFirst()
)

// API with cache-first strategy
workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)favorites/,
  workbox.strategies.cacheFirst()
)

// PUSH NOTIFICATIONS

// BACKGROUND SYNC

// GOOGLE ANALYTICS
