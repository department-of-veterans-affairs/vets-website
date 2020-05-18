const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const ENV = 'localhost';

  const options = {
    webpackOptions: {
      // Import our own Webpack config.
      ...require('../../../../../../config/webpack.config.js')(ENV),

      // Expose some Node globals.
      node: {
        __dirname: true,
        __filename: true,
      },
    },
  };

  on('file:preprocessor', webpackPreprocessor(options));
};
