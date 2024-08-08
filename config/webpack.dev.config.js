const path = require('path');
const setupLocalProxyRewrite = require('../src/applications/proxy-rewrite/local-proxy-rewrite');
const manifestHelpers = require('./manifest-helpers');

function generateWebpackDevConfig(buildOptions) {
  const routes = manifestHelpers.getAppRoutes();
  const appRewrites = routes
    .map(url => ({
      from: `^${url}(.*)`,
      to: `${url}/`,
    }))
    .sort((a, b) => b.from.length - a.from.length);

  const webSocketURL = {};
  try {
    const publicUrl = new URL(buildOptions.public);
    webSocketURL.hostname = publicUrl.hostname;
    webSocketURL.port = publicUrl.port || undefined;
    if (!webSocketURL.port) {
      webSocketURL.port = publicUrl.protocol === 'https:' ? 443 : 80;
    }
    webSocketURL.protocol = publicUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  } catch {
    webSocketURL.hostname = buildOptions.public || undefined;
  }

  // If in watch mode, use webpack devserver.
  return {
    historyApiFallback: {
      rewrites: [
        ...appRewrites,
        {
          from: '^/(.*)',
          to(context) {
            return context.parsedUrl.pathname;
          },
        },
      ],
    },
    hot: false,
    liveReload: false,
    static: {
      directory: path.resolve(
        __dirname,
        '../',
        'build',
        buildOptions.destination,
      ),
      watch: {
        poll: 1000,
      },
    },
    port: buildOptions.port,
    host: buildOptions.host,
    client: { webSocketURL },
    devMiddleware: {
      publicPath: '/generated/',
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
        warnings: true,
      },
      // Needed to write the landing pages to disk so webpack-dev-server will actually serve them
      writeToDisk: true,
    },
    setupMiddlewares: (middlewares, devServer) => {
      // We're doing this because some of the pages
      // that we are redirecting end with asp and we want
      // those to be treated as html
      devServer.app.get(/.*\.asp/, (req, res, next) => {
        res.type('html');
        next();
      });

      if (buildOptions['local-proxy-rewrite']) {
        setupLocalProxyRewrite(devServer, buildOptions);
      }

      return middlewares;
    },
  };
}

module.exports = generateWebpackDevConfig;
