const withSvgr = require('next-plugin-svgr');

/** @type {import('next').NextConfig} */
module.exports = withSvgr({
  // 1. Wyłączenie map źródłowych w przeglądarce (domyślnie false, ale warto wymusić)
  productionBrowserSourceMaps: false,

  experimental: {
    // 2. Wyłączenie map źródłowych po stronie serwera (opcja eksperymentalna)
    serverSourceMaps: false,
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              // Możesz spróbować wymusić brak map źródłowych dla samego loadera SVGR
              typescript: true,
              ext: 'tsx',
            },
          },
        ],
        as: '*.js',
      },
    },
  },
});



