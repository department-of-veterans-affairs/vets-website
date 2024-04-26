const path = require('path');
const setupLocalProxyRewrite = require('../src/applications/proxy-rewrite/local-proxy-rewrite');
const manifestHelpers = require('./manifest-helpers');
const vamcEhrData = require('../src/applications/mhv-landing-page/tests/fixtures/vamc-ehr.json');
const ENVIRONMENTS = require('../src/site/constants/environments');

function generateWebpackDevConfig(buildOptions) {
  const routes = manifestHelpers.getAppRoutes();
  const appRewrites = routes
    .map(url => ({
      from: `^${url}(.*)`,
      to: `${url}/`,
    }))
    .sort((a, b) => b.from.length - a.from.length);

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
    client: {
      webSocketURL: {
        hostname: buildOptions.public || undefined,
      },
    },
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

      // Serve vamc-ehr.json from yarn watch in local development
      if (buildOptions.host === ENVIRONMENTS.LOCALHOST) {
        devServer.app.get('/data/cms/vamc-ehr.json', (_, res) => {
          res.json(vamcEhrData);
        });
      }

      if (buildOptions['local-proxy-rewrite']) {
        setupLocalProxyRewrite(devServer, buildOptions);
      }

      return middlewares;
    },
  };
}

module.exports = generateWebpackDevConfig;
