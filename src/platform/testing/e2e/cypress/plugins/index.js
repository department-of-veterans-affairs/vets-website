const fs = require('fs');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const table = require('table').table;
const DefinePlugin = require('webpack').DefinePlugin;
const ProvidePlugin = require('webpack').ProvidePlugin;

const tableConfig = {
  columns: {
    0: { width: 15 },
    1: { width: 85 },
  },
};

module.exports = async on => {
  const ENV = 'localhost';
  const publicPath = '/generated/';
  let outputOptions = {};

  // Import our own Webpack config.
  await require('../../../../../../config/webpack.config.js')(ENV).then(
    webpackConfig => {
      // Get the original DefinePlugin so we can use __REGISTRY__
      const definePlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'DefinePlugin',
      );

      const appRegistry = definePlugin.definitions.__REGISTRY__;

      const options = {
        webpackOptions: {
          ...webpackConfig,
          plugins: [
            new DefinePlugin({
              __BUILDTYPE__: JSON.stringify(ENV),
              __API__: JSON.stringify(''),
              __REGISTRY__: appRegistry,
            }),
            new ProvidePlugin({
              process: 'process/browser',
            }),
          ],

          // Expose some Node globals.
          node: {
            __dirname: true,
            __filename: true,
          },
        },
      };

      // Webpack 5 workaround to keep Cypress from unsetting publicPath
      // https://github.com/cypress-io/cypress/issues/8900
      Object.defineProperty(options.webpackOptions, 'output', {
        get: () => {
          return { ...outputOptions, publicPath };
        },
        set: x => {
          outputOptions = x;
        },
      });

      on('file:preprocessor', webpackPreprocessor(options));
    },
  );

  on('after:spec', (spec, results) => {
    if (results.stats.failures === 0 && results.video) {
      fs.unlinkSync(results.video);
    }
  });

  on('task', {
    /* eslint-disable no-console */
    log: message => console.log(message) || null,
    table: message => console.log(table(message, tableConfig)) || null,
    /* eslint-enable no-console */
  });
};
