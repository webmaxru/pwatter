module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{txt,png,ico,html,js,json,css}'
  ],
  globIgnores: [
    'workbox-v3.0.0/**/*'
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
