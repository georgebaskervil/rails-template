module.exports = {
    presets: [
      ['@babel/preset-env', {
        useBuiltIns: 'usage', // Adds polyfills based on usage
        corejs: 3, // Specify core-js version for polyfills
      }],
    ],
  };