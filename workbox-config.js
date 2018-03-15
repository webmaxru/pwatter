module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{txt,png,ico,html,js,json,css}'
  ],
  globIgnores: [
    'workbox-v3.0.0/**/*'
  ],
  swDest: 'dist/sw.js',

  // Define runtime caching rules.
  runtimeCaching: [
    {
      // Match any request ends with .png, .jpg, .jpeg or .svg.
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

      // Apply a cache-first strategy.
      handler: 'cacheFirst',

      options: {
        // Only cache 10 images.
        expiration: {
          maxEntries: 10
        }
      }
    }
  ]
}
