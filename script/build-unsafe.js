// Builds the site using Metalsmith as the top-level build runner.

// This unsafe build removes almost all checks and strips down the
// build process. Intent is to allow fast, lenient deploys to Heroku
// for rapid iteration on content and visual design with a shared
// review app.
process.stdout.write(`Unsafe Build -- For use on Heroku only`);

const Metalsmith = require('metalsmith');
const archive = require('metalsmith-archive');
const assets = require('metalsmith-assets');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const define = require('metalsmith-define');
const filenames = require('metalsmith-filenames');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const liquid = require('tinyliquid');
const markdown = require('metalsmith-markdownit');
const moment = require('moment');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');
const webpack = require('metalsmith-webpack');
const webpackConfigGenerator = require('../config/webpack.config');
const semver = require('semver');

const fs = require('fs');
const path = require('path');

const sourceDir = '../content/pages';

const smith = Metalsmith(__dirname); // eslint-disable-line new-cap

const webpackConfig = webpackConfigGenerator(options);

// Custom liquid filter(s)
liquid.filters.humanizeDate = (dt) => moment(dt).format('MMMM D, YYYY');


// Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
// add comments about any implicit dependencies you are introducing!!!
//
smith.source(sourceDir);
smith.destination(`../build/development`);

// This lets us access the {{buildtype}} variable within liquid templates.
smith.metadata({ buildtype: 'development' });

// This adds the filename into the "entry" that is passed to other plugins. Without this errors
// during templating end up not showing which file they came from. Load it very early in in the
// plugin chain.
smith.use(filenames());

smith.use(define({
  // Does anything even look at `site`?
  site: require('../config/site'),
  buildtype: development
}));

// See the collections documentation here:
// https://github.com/segmentio/metalsmith-collections
// Can sort by any front matter property you'd like, or by function.
// Can define a collection by its path or by adding a `collection`
// property to the Markdown document.

smith.use(collections({
  disabilityAgentOrange: {
    pattern: 'disability-benefits/conditions/exposure-to-hazardous-materials/agent-orange/*.md',
    sortBy: 'order',
    metadata: {
      name: 'Agent Orange'
    }
  },
  disabilityExposureHazMat: {
    pattern: 'disability-benefits/conditions/exposure-to-hazardous-materials/*.md',
    sortBy: 'title',
    metadata: {
      name: 'Exposure to Hazardous Materials'
    }
  },
  education: {
    pattern: 'education/*.md',
    sortBy: 'order',
    metadata: {
      name: 'Education Benefits'
    }
  },
  educationGIBill: {
    pattern: 'education/gi-bill/*.md',
    sortBy: 'order',
    metadata: {
      name: 'GI Bill'
    }
  }
}));

smith.use(dateInFilename(true));
smith.use(archive());  // TODO(awong): Can this be removed?

smith.use(webpack(webpackConfig));

smith.use(assets({ source: '../assets', destination: './' }));

const destination = path.resolve(__dirname, `../build/development`);

// Webpack paths are absolute, convert to relative
smith.use((files, metalsmith, done) => {
  Object.keys(files).forEach((file) => {
    if (file.indexOf(destination) === 0) {
      /* eslint-disable no-param-reassign */
      files[file.substr(destination.length + 1)] = files[file];
      delete files[file];
      /* esling-enable no-param-reassign */
    }
  });

  done();
});

// Liquid substitution must occur before markdown is run otherwise markdown will escape the
// bits of liquid commands (eg., quotes) and break things.
//
// Unfortunately this must come before permalinks and navgation because of limitation in both
// modules regarding what files they understand. The consequence here is that liquid templates
// *within* a single file do NOT have access to the final path that they will be rendered under
// or any other metadata added by the permalinks() and navigation() filters.
//
// Thus far this has not been a problem because the only references to such paths are in the
// includes which are handled by the layout module. The layout module, luckily, can be run
// near the end of the filter chain and therefore has access to all the metadata.
//
// If this becomes a barrier in the future, permalinks should be patched to understand
// translating .md files which would allow inPlace() and markdown() to be moved under the
// permalinks() and navigation() filters making the variable stores uniform between inPlace()
// and layout().
smith.use(inPlace({ engine: 'liquid', pattern: '*.{md,html}' }));
smith.use(markdown({
  typographer: true,
  html: true
}));

// Responsible for create permalink structure. Most commonly used change foo.md to foo/index.html.
//
// This must come before navigation module, otherwise breadcrunmbs will see the wrong URLs.
//
// It also must come AFTER the markdown() module because it only recognizes .html files. See
// comment above the inPlace() module for explanation of effects on the metadata().
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

// Note that there is no default layout specified.
// All pages must explicitly declare a layout or else it will be rendered as raw html.
smith.use(layouts({
  engine: 'liquid',
  directory: '../content/layouts/',
  // Only apply layouts to markdown and html files.
  pattern: '**/*.{md,html}'
}));

/* eslint-disable no-console */
smith.build((err) => {
  if (err) throw err;
  console.log('Build finished!');
});
