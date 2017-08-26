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
  cacheableResponse: {statuses: [0, 200]}
})

workboxSW.router.registerRoute(
  /(http[s]?:\/\/)?([^\/\s]+\/)timeline/,
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
  handler: ({event}) => {
    console.log('[SW] Routed through the default handler', event.request);
    return fetch(event.request);
  },
});
