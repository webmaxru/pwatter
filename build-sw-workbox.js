const swBuild = require('workbox-build')

// https://workboxjs.org/reference-docs/latest/module-workbox-build.html#.injectManifest
swBuild
  .injectManifest({
    globDirectory: 'dist/',
    globPatterns: [
      '**/*.{txt,png,ico,html,js,json,css}'
    ],
    globIgnores: ['3rdpartylicenses.txt'],
    swSrc: './src/sw-workbox.js',
    swDest: './dist/sw-workbox.js'
  })
  .then(() => {
    console.log('Manifest injected into service worker')
  })
