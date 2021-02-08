const path = require('path');
const setupLocalProxyRewrite = require('../src/applications/proxy-rewrite/local-proxy-rewrite');
const manifestHelpers = require('./manifest-helpers');
const BUCKETS = require('../src/site/constants/buckets');

function generateWebpackDevConfig(buildOptions) {
  const routes = manifestHelpers.getAppRoutes();
  const appRewrites = routes
    .map(url => ({
      from: `^${url}(.*)`,
      to: `${url}/`,
    }))
    .sort((a, b) => b.from.length - a.from.length);

  // This buildType likely always be 'localhost', but adding in to match patterns elsewhere and just incase we ever need it
  const publicAssetPath =
    buildOptions.setPublicPath && buildOptions.buildtype !== 'localhost'
      ? `${BUCKETS[buildOptions.buildtype]}/generated/`
      : '/generated/';

  // If in watch mode, assume hot reloading for JS and use webpack devserver.
  return {
    contentBase: path.resolve(
      __dirname,
      '../',
      'build',
      buildOptions.destination,
    ),
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
    watchOptions: {
      poll: 1000,
    },
    port: buildOptions.port,
    publicPath: publicAssetPath,
    host: buildOptions.host,
    public: buildOptions.public || undefined,
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
    before: app => {
      // We're doing this because some of the pages
      // that we are redirecting end with asp and we want
      // those to be treated as html
      app.use(/.*\.asp/, (req, res, next) => {
        res.type('html');
        next();
      });

      if (buildOptions['local-proxy-rewrite']) {
        setupLocalProxyRewrite(app, buildOptions);
      }
    },
  };
}

module.exports = generateWebpackDevConfig;
