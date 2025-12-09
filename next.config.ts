// next.config.js
const withSvgr = require('next-plugin-svgr');

module.exports = withSvgr({
// Source - https://stackoverflow.com/a
// Posted by Moeid Kh
// Retrieved 2025-12-08, License - CC BY-SA 4.0

turbopack: {
  rules: {
    '*.svg': {
      loaders: ['@svgr/webpack'],
      as: '*.js',
    },
  },
},

});