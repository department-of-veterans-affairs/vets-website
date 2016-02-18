// Karma configuration
// Generated on Wed Dec 30 2015 15:40:11 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'chai-jquery',
      'chai-as-promised',
      'jquery-1.8.3',
      'chai',
      'fixture'
    ],

    // list of files / patterns to load in the browser
    files: [
      'spec/javascripts/**/*.spec.js',
      { pattern: '_site/health-care/form/index.html', watched: true, included: false, served: true, nocache: true },
      { pattern: '_site/**/*', watched: false, included: false, served: true, nocache: true },
      { pattern: 'spec/fixtures/javascripts/**/*', watched: true, included: false, served: true, nocache: true },
      { pattern: 'spec/fixtures/html/**/*' },
      { pattern: 'spec/fixtures/json/**/*' }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/javascripts/**/*.spec.js': ['webpack'],
      'spec/fixtures/html/**/*.html'   : ['html2js'],
      'spec/fixtures/json/**/*.json'   : ['json_fixtures']
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
          }
        ]
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Make Karma insert a Content-Security-Policy that disables all resource
    // loads that don't original from the same origin. This enforces
    // hermeticity in the test by terminating network loads if the page
    // happens to have a reference to something like Google analytics.
    // In PhantomJS, this is particularly critical because there will be no
    // resource cache. Test times dropped from ~4s to ~1s with this.
    customHeaders: [
      {
        match: '.*\.html',
        name: 'Content-Security-Policy',
        value: "default-src 'self' about:blank; script-src 'self' 'unsafe-inline'"
      },
      {
        // Phantom-JS 1.8.x still uses the vendor prefix. Note this is a hack
        // as the vendor-prefixed behavior diverges from spec and is buggy.
        // However, for our current usage of best-effort reducing of external
        // dependencies in a test, this is good enough.
        match: '.*\.html',
        name: 'X-WebKit-CSP',
        value: "default-src 'self' about:blank; script-src 'self' 'unsafe-inline'"
      }
    ],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'PhantomJS_debug'],

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

    proxies: {
      // Allow iframes to load javascript assets.
      '/assets/': '/base/_site/assets',

      // Allow client-side routing to work correctly.
      '/health-care/': '/base/_site/health-care'
    },

    // Used by karma-fixture to serve up html and json fixtures.
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
