// Karma configuration
// Generated on Wed Dec 30 2015 15:40:11 GMT-0800 (PST)
var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha' ],

    // list of files / patterns to load in the browser
    files: [
      // PhantomJS doesn't have ES6 Promises.
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/**/*.spec.js?(x)'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.spec.js?(x)': ['webpack', 'sourcemap'],
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              // es2015 is current name for the es6 settings.
              presets: ['es2015'],

              // Speed up compilation.
              cacheDirectory: true
            }
          },
          {
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              // es2015 is current name for the es6 settings.
              presets: ['es2015', 'react'],

              // Speed up compilation.
              cacheDirectory: true
            }
          }
        ]
      },
      plugins: [
        new webpack.IgnorePlugin(/ReactContext/)
      ],
      resolve: {
        extensions: ['', '.js', '.jsx']
      }
    },

    webpackMiddleware: {
      // Reduce spam from webpack builds.
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    customLaunchers: {
      'PhantomJS_debug': {
        base: 'PhantomJS',
        debug: true
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // to avoid DISCONNECTED messages when connecting
    // TODO(awong): look into why browser was timing out
    browserNoActivityTimeout: 60000, //default 10000

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
