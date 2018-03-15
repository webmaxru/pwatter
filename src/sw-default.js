//importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js')

importScripts('workbox-v3.0.0/workbox-sw.js')

// Settings

workbox.setConfig({ debug: true })

/* workbox.core.setCacheNameDetails({
  prefix: 'pwatter',
  suffix: 'v1',
  precache: 'workbox-precache',
  runtime: 'workbox-runtime'
}) */

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

workbox.skipWaiting()
workbox.clientsClaim()

// Precaching

workbox.precaching.precacheAndRoute([])

/* workbox.precaching.addPlugins([
    new workbox.broadcastUpdate.Plugin({
        channelName: 'api-updates',
      })
]); */

// Runtime caching

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30
      })
    ]
  })
)

workbox.routing.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)timeline/,
  workbox.strategies.staleWhileRevalidate()
)

workbox.routing.registerRoute(
  new RegExp('(http[s]?:\/\/)?([^\/\s]+\/)favorites'),
  workbox.strategies.staleWhileRevalidate()
)

// Google Analytics

workbox.googleAnalytics.initialize()

// Push notifications

self.addEventListener('push', function (event) {
  log('[Service Worker]: Received push event')

  var notificationData = {}

  if (event.data) {
    notificationData = event.data.json().notification // "notification node is specific for @angular/service-worker
  } else {
    notificationData = {
      title: 'Something Has Happened',
      message: 'Something you might want to check out',
      icon: '/assets/images/logo.png'
    }
  }

  self.registration.showNotification(notificationData.title, notificationData)
})

self.addEventListener('notificationclick', function (event) {
  log('[Service Worker]: Received notificationclick event')

  event.notification.close()

  if (event.action == 'opentweet') {
    log('[Service Worker]: Performing action opentweet')

    event.waitUntil(
      clients.openWindow(event.notification.data).then(function (windowClient) {
        // do something with the windowClient.
      })
    )
  } else {
    log('[Service Worker]: Performing default click action')

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(

      clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
      })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i]
            if (client.url == '/' && 'focus' in client)
              return client.focus()
          }
          if (clients.openWindow)
            return clients.openWindow('/')
        }))
  }
})

// Background sync

const bgSyncPlugin = new workbox.backgroundSync.Plugin('tweetsQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
})

workbox.routing.registerRoute(
  /\/post-tweet/,
  workbox.strategies.networkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
)
