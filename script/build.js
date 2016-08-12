// Builds the site using Metalsmith as the top-level build runner.

const Metalsmith = require('metalsmith');
const archive = require('metalsmith-archive');
const assets = require('metalsmith-assets');
const collections = require('metalsmith-collections');
const commandLineArgs = require('command-line-args')
const dateInFilename = require('metalsmith-date-in-filename');
const define = require('metalsmith-define');
const excerpts = require('metalsmith-excerpts');
const filenames = require('metalsmith-filenames');
const ignore = require('metalsmith-ignore');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdownit');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');
const sitemap = require('metalsmith-sitemap');
const watch = require('metalsmith-watch');
const webpack = require('metalsmith-webpack');
const webpackConfigGenerator = require('../config/webpack.config');
const webpackDevServer = require('metalsmith-webpack-dev-server');

const sourceDir = '../content/pages';

const smith = Metalsmith(__dirname);

const optionDefinitions = [
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'port', type: Number, defaultValue: 3000 },
  { name: 'buildtype', type: String, defaultValue: 'development' },
  { name: 'no-sanity-check-node-env', type: Boolean, defaultValue: false },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

const env = require('get-env')();

if (options.unexpected && options.unexpected.length !== 0) {
    throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

if (options.buildtype === undefined) {
  options.buildtype = 'development';
}

switch (options.buildtype) {
  case 'development':
    // No extra checks needed in dev.
    break;

  case 'production':
    if (options['no-sanity-check-node-env'] === false) {
      if (env != 'prod') {
        throw new Error(`buildtype ${options.buildtype} expects NODE_ENV to be production, not '${process.env.NODE_ENV}'`);
      }
    }
    break;

  default:
    throw new Error(`Unknown buildtype: '${options.buildtype}'`);
}

const webpackConfig = webpackConfigGenerator(options);

// Basic setup.
smith.source(sourceDir);
smith.destination(`../build/${options.buildtype}`);

// Set up the middleware. DO NOT CHANGE THE ORDER OF PLUGINS.
if (options.buildtype === 'production') {
  smith.use(ignore([
    'rx/*',
  ]));
}
smith.use(collections());
smith.use(dateInFilename(true));
smith.use(filenames());
smith.use(inPlace({ engine: 'liquid' }));
smith.use(markdown({
  typographer: true,
  html: true
}));
smith.use(archive());

// Responsible for create permalink structure. Most commonly used change foo.md to foo/index.html.
smith.use(permalinks({
  relative: false,
  linksets: [{
    match: { collection: 'posts' },
    pattern: ':date/:slug'
  }]
}));

smith.use(navigation({
  navConfigs: {
    sortByNameFirst: true,
    breadcrumbProperty: 'breadcrumb_path',
    pathProperty: 'nav_path',
    includeDirs: true
  }, navSettings: {} }));

// TODO(awong): Remove the default layout. Having a default layout makes it impossible to
// write a bare HTML page and it is just less explicit.
//
// https://github.com/department-of-veterans-affairs/vets-website/issues/2713
smith.use(layouts({
  engine: 'liquid',
  'default': 'page-breadcrumbs.html',
  directory: '../content/layouts/',
  // Only apply layouts to markdown and html files.
  pattern: '**/*.{md,html}'
}));
smith.use(assets({ source: '../assets', destination: './' }));
// TODO(awong): This URL needs to change based on target environment.
smith.use(sitemap('http://www.vets.gov'));
smith.use(define({
  site: require('../config/site'),
  buildtype: options.buildtype
}));

if (options.watch) {
  // TODO(awong): Enable live reload of metalsmith pages per instructions at
  //   https://www.npmjs.com/package/metalsmith-watch
  smith.use(watch());

  // If in watch mode, assume hot reloading for JS and use webpack devserver.
  smith.use(webpackDevServer(
    webpackConfig,
    {
      contentBase: `build/${options.buildtype}`,
      historyApiFallback: false,
      hot: true,
      port: options.port,
      publicPath: '/generated/',
      stats: { colors: true }
    }
  ));
} else {
  smith.use(webpack(webpackConfig));
}

smith.build(function(err) {
    if (err) throw err;
    console.log('Build finished!');
  });
