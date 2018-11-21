/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
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
    "url": "assets/favicon/android-chrome-192x192.png",
    "revision": "a3fae3855e3cbed6db036fba32d2dbf4"
  },
  {
    "url": "assets/favicon/android-chrome-512x512.png",
    "revision": "3b82f6028a3d753c475198f55f52d25b"
  },
  {
    "url": "assets/favicon/apple-touch-icon.png",
    "revision": "ae64503f5ed8bbe73d2b51831322950a"
  },
  {
    "url": "assets/favicon/favicon-16x16.png",
    "revision": "a8174c82b47d7380f4d5cc5bb9d2d095"
  },
  {
    "url": "assets/favicon/favicon-32x32.png",
    "revision": "50f4b2cd16cc9661ae16cf69e6812920"
  },
  {
    "url": "assets/images/logo.png",
    "revision": "f5fd664cc80a6c77d6c79e5bd2653426"
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
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/, workbox.strategies.staleWhileRevalidate(), 'GET');
