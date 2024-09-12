module.exports = {
    plugins: [
      require('postcss-preset-env')({
        stage: 3, // Stage 3 is more stable than stage 2, includes fewer experimental features
        features: {
          'custom-properties': false, // Still disabled for IE compatibility
          'nesting-rules': true, // Enable if you want this feature polyfilled
        },
      }),
      require('oldie')(), // Adds necessary polyfills for older IE versions
      require('cssnano')({
        preset: ['default', {
          discardComments: {removeAll: true},
        }],
      }),
    ]
  };