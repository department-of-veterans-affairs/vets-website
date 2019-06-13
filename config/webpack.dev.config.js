const setupLocalProxyRewrite = require('../src/applications/proxy-rewrite/local-proxy-rewrite');
const appSettings = require('./parse-app-settings');

function generateWebpackDevConfig(buildOptions) {
  appSettings.parseFromBuildOptions(buildOptions);

  const routes = appSettings.getAllApplicationRoutes();
  const appRewrites = routes
    .map(url => ({
      from: `^${url}(.*)`,
      to: `${url}/`,
    }))
    .sort((a, b) => b.from.length - a.from.length);

  // If in watch mode, assume hot reloading for JS and use webpack devserver.
  const devServerConfig = {
    contentBase: buildOptions.destination,
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
    port: buildOptions.port,
    publicPath: '/generated/',
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

  return devServerConfig;
}

module.exports = generateWebpackDevConfig;
