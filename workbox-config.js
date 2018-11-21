module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{txt,json,png,ico,html,js,css}'
  ],
  globIgnores: [
    'workbox-v3.6.3/**/*'
  ],
  swDest: 'dist/sw.js',

  // Define runtime caching rules
  runtimeCaching: [
    {
      urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
      handler: 'staleWhileRevalidate'
    }
  ]
}
