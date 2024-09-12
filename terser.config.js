module.exports = {
    ecma: 5, // Use ECMAScript 5 syntax for compatibility with older browsers
    compress: {
      drop_console: true, // Remove console statements in production
    },
    mangle: {
      safari10: true, // Fixes issues in Safari 10/11 which are similar to old IE issues
    },
    output: {
      comments: false, // Remove all comments
    },
  };