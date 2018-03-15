const {injectManifest} = require('workbox-build')
var workboxConfig = require('./workbox-config.js')

workboxConfig.swSrc = 'src/sw-default.js'
delete workboxConfig.runtimeCaching

const swSrc = 'src/sw-default.js'
const swDest = 'dist/sw.js'
injectManifest(workboxConfig)
  .then(({count, size}) => {
    console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`)
  })
