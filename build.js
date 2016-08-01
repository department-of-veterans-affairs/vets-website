// Builds the site using Metalsmith as the top-level build runner.

const Metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const filenames = require('metalsmith-filenames');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const watch = require('metalsmith-watch');
const webpack = require('metalsmith-webpack');
const webpackConfig = require('./webpack.config');
const webpackDevServer = require('metalsmith-webpack-dev-server');

const sourceDir = 'content/pages';

const smith = Metalsmith(__dirname);

// Basic setup.
smith.source(sourceDir);
smith.destination('build');

// Set up the middleware.
smith.use(markdown());
smith.use(dateInFilename(true));
smith.use(filenames());
smith.use(permalinks({ pattern: ':collections/:title' }));
smith.use(layouts({ engine: 'swig', directory: 'content/layouts' }));
smith.use(collections());

// If in hot-reload mode, use webpack devserver.
// TODO(awong): Pick the right environment variables.
if (process.env.AWONG_TEST == 'watch') {
  // TODO(awong): Enable live reload of metalsmith pages per instructions at
  //   https://www.npmjs.com/package/metalsmith-watch
  smith.use(watch());
  smith.use(webpackDevServer(
    webpackConfig,
    {
      hot: true,
      contentBase: 'build',
      publicPath: '/generated/',
      historyApiFallback: false,
      stats: {colors: true}
    }
  ));
} else {
  smith.use(webpack(webpackConfig));
}

smith.build(function(err) {
    if (err) throw err;
    console.log('Build finished!');
  });
