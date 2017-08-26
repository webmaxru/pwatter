importScripts('./workbox-sw.dev.v2.0.0.js')

importScripts('./workbox-routing.dev.v2.0.0.js')
importScripts('./workbox-runtime-caching.dev.v2.0.0.js')
importScripts('./workbox-cacheable-response.dev.v2.0.0.js')
importScripts('./workbox-background-sync.dev.v2.0.0.js')

const workboxSW = new WorkboxSW({
  precacheChannelName: 'pwatter-channel'
})
workboxSW.precache([])

const apiStrategy = workboxSW.strategies.networkFirst({
  cacheName: 'api',
  networkTimeoutSeconds: 3
})

const avatarsCacheStrategy = workboxSW.strategies.cacheFirst({
  cacheName: 'avatars',
  cacheExpiration: {
    maxEntries: 10,
    maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
  },
  cacheableResponse: {
    statuses: [0, 200]
  }
})

workboxSW.router.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)(timeline|favorites)/,
  apiStrategy
)

workboxSW.router.registerRoute(
  /http[s]:\/\/pbs\.twimg\.com/,
  avatarsCacheStrategy
)

// Caching using separate modules

const cacheablePlugin = new workbox.cacheableResponse.CacheableResponsePlugin({
  statuses: [0, 200]
});

const fontsRequestWrapper = new workbox.runtimeCaching.RequestWrapper({
  cacheName: 'fonts',
  plugins: [
    cacheablePlugin
  ]
});

const fontsCacheStrategy = new workbox.runtimeCaching.CacheFirst({
  requestWrapper: fontsRequestWrapper
})

const fontsRoute = new workbox.routing.RegExpRoute({
  regExp: /http[s]:\/\/fonts\.(gstatic|googleapis)\.com(.*)/,
  handler: fontsCacheStrategy
});


// Background sync

let syncQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('PWAtter', {
        body: 'Tweet was posted',
        icon: '/assets/images/logo.png',
      })
      console.log('[SW] Tweet was posted')
    },
    replayDidFail: (hash) => {},
    requestWillEnqueue: (reqData) => {
      console.log('[SW] Request queued', reqData)
    },
    requestWillDequeue: (reqData) => {
      console.log('[SW] Request dequeued', reqData)
    },
  },
})

const postTweetRequestWrapper = new workbox.runtimeCaching.RequestWrapper({
  plugins: [
    syncQueue
  ]
})

const postTweetCacheStrategy = new workbox.runtimeCaching.NetworkOnly({
  requestWrapper: postTweetRequestWrapper
})

const postTweetRoute = new workbox.routing.RegExpRoute({
  regExp: /(http[s]?:\/\/)?([^\/\s]+\/)post-tweet/,
  handler: postTweetCacheStrategy,
  method: 'POST'
})


// Setting up custom router

const router = new workbox.routing.Router();
router.registerRoutes({
  routes: [fontsRoute, postTweetRoute]
});
router.addFetchListener();

router.setDefaultHandler({
  handler: ({
    event
  }) => {
    console.log('[SW] Routed through the default handler', event.request);
    return fetch(event.request);
  },
});

// Push

self.addEventListener('push', function (event) {
  console.log('[SW] Received push event')

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
  console.log('[SW] Received notificationclick event')

  event.notification.close()

  if (event.action == 'opentweet') {
    console.log('[SW] Performing action opentweet')

    event.waitUntil(
      clients.openWindow(event.notification.data.url).then(function (windowClient) {
        // do something with the windowClient.
      })
    )
  } else {
    console.log('[SW] Performing default click action')

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

self.addEventListener('notificationclose', function (event) {
  console.log('[SW] Received notificationclose event')
})
