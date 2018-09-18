const {
  getRoutes
} = require('./server-rewrites');

function generateWebpackDevConfig(buildOptions, manifests) {
  const appRewrites = getRoutes(buildOptions.settings).map(url => {
    return {
      from: `^${url}(.*)`,
      to: `${url}/`
    };
  }).sort((a, b) => b.from.length - a.from.length);

  // If in watch mode, assume hot reloading for JS and use webpack devserver.
  const devServerConfig = {
    contentBase: buildOptions.destination,
    historyApiFallback: {
      rewrites: [
        ...appRewrites,
        { from: '^/(.*)', to(context) { return context.parsedUrl.pathname; } }
      ],
    },
    hot: true,
    port: buildOptions.port,
    publicPath: '/generated/',
    host: buildOptions.host,
    'public': buildOptions.public || undefined,
    stats: {
      colors: true,
      assets: false,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      entrypoints: false,
      children: false,
      modules: false,
      warnings: true
    }
  };

  // Route all API requests through webpack's node-http-proxy
  // Useful for local development.
  try {
    // Check to see if we have a proxy config file
    // eslint-disable-next-line import/no-unresolved
    const api = require('./config.proxy.js').api;
    devServerConfig.proxy = {
      '/api/v0/*': {
        target: `https://${api.host}/`,
        auth: api.auth,
        secure: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        rewrite: function rewrite(req) {
          /* eslint-disable no-param-reassign */
          req.headers.host = api.host;
          /* eslint-enable no-param-reassign */
        }
      }
    };
    // eslint-disable-next-line no-console
    console.log('API proxy enabled');
  } catch (e) {
    // No proxy config file found.
  }

  return devServerConfig;
}

module.exports = generateWebpackDevConfig;
