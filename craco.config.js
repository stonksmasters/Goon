// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url/'),
        util: require.resolve('util/'),
        process: require.resolve('process/browser.js'), // Include .js extension
        buffer: require.resolve('buffer'),
      };
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js', // Include .js extension
          Buffer: ['buffer', 'Buffer'],
        }),
      ];
      return webpackConfig;
    },
  },
};
