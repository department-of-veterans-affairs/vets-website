const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const env = 'localhost';

  const options = {
    webpackOptions: require('../../../../../../config/webpack.config.js')(env),
  };

  on('file:preprocessor', webpackPreprocessor(options));
};
