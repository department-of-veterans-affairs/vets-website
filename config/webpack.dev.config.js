const path = require('path');
const fs = require('fs');
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

      // Inject skeleton HTML into pages served by webpack-dev-server
      const skeletonManifestPath = path.join(
        __dirname,
        '../build',
        buildOptions.destination,
        'generated',
        'skeleton-manifest.json',
      );

      if (fs.existsSync(skeletonManifestPath)) {
        const skeletonManifest = JSON.parse(
          fs.readFileSync(skeletonManifestPath, 'utf8'),
        );

        // Add middleware to inject skeleton HTML
        devServer.app.use((req, res, next) => {
          const originalSend = res.send;

          res.send = function(data) {
            let modifiedData = data;
            // Only process HTML responses
            if (
              typeof data === 'string' &&
              res.get('Content-Type')?.includes('text/html')
            ) {
              // Check if this URL matches any skeleton entry
              Object.keys(skeletonManifest).forEach(entryName => {
                const { html: skeletonHTML, rootUrl } = skeletonManifest[
                  entryName
                ];

                if (req.path === rootUrl || req.path === `${rootUrl}/`) {
                  // Inject skeleton HTML
                  const reactRootStart = modifiedData.indexOf(
                    '<div id="react-root">',
                  );
                  const reactRootEnd = modifiedData.indexOf(
                    '</div>',
                    reactRootStart,
                  );

                  if (reactRootStart !== -1 && reactRootEnd !== -1) {
                    // Find the actual closing tag by counting nested divs
                    let depth = 1;
                    let pos = reactRootStart + '<div id="react-root">'.length;
                    while (depth > 0 && pos < modifiedData.length) {
                      const nextOpen = modifiedData.indexOf('<div', pos);
                      const nextClose = modifiedData.indexOf('</div>', pos);

                      if (nextClose === -1) break;

                      if (nextOpen !== -1 && nextOpen < nextClose) {
                        depth += 1;
                        pos = nextOpen + 4;
                      } else {
                        depth -= 1;
                        if (depth === 0) {
                          // Found the matching closing tag
                          const before = modifiedData.substring(
                            0,
                            reactRootStart + '<div id="react-root">'.length,
                          );
                          const after = modifiedData.substring(nextClose);
                          modifiedData = `${before}\n              ${skeletonHTML}\n            ${after}`;
                          break;
                        }
                        pos = nextClose + 6;
                      }
                    }
                  }
                }
              });
            }

            originalSend.call(this, modifiedData);
          };

          next();
        });
      }

      return middlewares;
    },
  };
}

module.exports = generateWebpackDevConfig;
