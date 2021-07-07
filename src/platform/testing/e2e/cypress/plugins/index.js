const fs = require('fs');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const ENV = 'localhost';

  // Import our own Webpack config.
  require('../../../../../../config/webpack.config.js')(ENV).then(
    webpackConfig => {
      const options = {
        webpackOptions: {
          ...webpackConfig,

          // Expose some Node globals.
          node: {
            __dirname: true,
            __filename: true,
          },
        },
      };

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
    table: message => console.table(message) || null,
    /* eslint-enable no-console */
  });
};
