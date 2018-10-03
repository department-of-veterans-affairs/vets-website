// Builds the site using Metalsmith as the top-level build runner.
const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const filenames = require('metalsmith-filenames');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const liquid = require('tinyliquid');
const markdown = require('metalsmith-markdownit');
const moment = require('moment');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');
const sitemap = require('metalsmith-sitemap');
const watch = require('metalsmith-watch');

const webpackMetalsmithConnect = require('../config/webpack-metalsmith-connect');
const environments = require('./constants/environments');
const createBuildSettings = require('./create-build-settings');
const createRedirects = require('./create-redirects');
const checkBrokenLinks = require('./check-broken-links');
const createEnvironmentFilter = require('./create-environment-filter');
const nonceTransformer = require('./metalsmith/nonceTransformer');
const addAssetHashes = require('./configure-assets');
const rewriteVaDomains = require('./rewrite-va-domains');
const BUILD_OPTIONS = require('./options');

const smith = Metalsmith(__dirname); // eslint-disable-line new-cap

// Custom liquid filter(s)
liquid.filters.humanizeDate = dt => moment(dt).format('MMMM D, YYYY');

// Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
// add comments about any implicit dependencies you are introducing!!!
//
smith.source(`${BUILD_OPTIONS.contentRoot}/pages`);
smith.destination(BUILD_OPTIONS.destination);

// This lets us access the {{buildtype}} variable within liquid templates.
smith.metadata({
  buildtype: BUILD_OPTIONS.buildtype,
  mergedbuild: !!BUILD_OPTIONS['brand-consolidation-enabled'], // @deprecated - We use a separate Metalsmith directory for VA.gov. We shouldn't ever need this info in Metalsmith files.
});

smith.use(createEnvironmentFilter(BUILD_OPTIONS));

// This adds the filename into the "entry" that is passed to other plugins. Without this errors
// during templating end up not showing which file they came from. Load it very early in in the
// plugin chain.
smith.use(filenames());

smith.use(collections(BUILD_OPTIONS.collections));
smith.use(dateInFilename(true));

smith.use(assets(BUILD_OPTIONS.assets));

// smith.use(cspHash({ pattern: ['js/*.js', 'generated/*.css', 'generated/*.js'] }))

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
smith.use(
  markdown({
    typographer: true,
    html: true,
  }),
);

// Responsible for create permalink structure. Most commonly used change foo.md to foo/index.html.
//
// This must come before navigation module, otherwise breadcrunmbs will see the wrong URLs.
//
// It also must come AFTER the markdown() module because it only recognizes .html files. See
// comment above the inPlace() module for explanation of effects on the metadata().
smith.use(
  permalinks({
    relative: false,
    linksets: [
      {
        match: { collection: 'posts' },
        pattern: ':date/:slug',
      },
    ],
  }),
);

smith.use(
  navigation({
    navConfigs: {
      sortByNameFirst: true,
      breadcrumbProperty: 'breadcrumb_path',
      pathProperty: 'nav_path',
      includeDirs: true,
    },
    navSettings: {},
  }),
);

smith.use(
  layouts({
    engine: 'liquid',
    directory: `${BUILD_OPTIONS.contentRoot}/layouts/`,
    // Only apply layouts to markdown and html files.
    pattern: '**/*.{md,html}',
  }),
);

/*
Add nonce attribute with substition string to all inline script tags
Convert onclick event handles into nonced script tags
*/
smith.use(nonceTransformer);

/* 
 * This will replace links in static pages with a staging domain,
 * if it is in the list of domains to replace
 */
smith.use(rewriteVaDomains(BUILD_OPTIONS));

// Create the data passed from the content build to the assets compiler.
// On the server, it can be accessed at BUILD_OPTIONS.buildSettings.
// In the browser, it can be accessed at window.settings.
smith.use(createBuildSettings(BUILD_OPTIONS));

if (BUILD_OPTIONS.watch) {
  const watchPaths = {
    [`${BUILD_OPTIONS.contentRoot}/**/*`]: '**/*.{md,html}',
  };
  const watchMetalSmith = watch({ paths: watchPaths, livereload: true });
  smith.use(watchMetalSmith);
  smith.use(webpackMetalsmithConnect.watchAssets(BUILD_OPTIONS));
} else {
  smith.use(webpackMetalsmithConnect.compileAssets(BUILD_OPTIONS));

  const isDevBuild = [environments.DEVELOPMENT, environments.VAGOVDEV].includes(
    BUILD_OPTIONS.buildtype,
  );
  if (!isDevBuild) {
    smith.use(addAssetHashes(BUILD_OPTIONS));
  }

  if (process.env.CHECK_BROKEN_LINKS !== 'no') {
    smith.use(checkBrokenLinks(BUILD_OPTIONS));
  }
}

smith.use(
  sitemap({
    hostname:
      BUILD_OPTIONS.host === 'localhost'
        ? 'http://localhost'
        : BUILD_OPTIONS.host,
    omitIndex: true,
  }),
);

// Pages can contain an "alias" property in their metadata, which is processed into
// separate pages that will each redirect to the original page.
smith.use(createRedirects(BUILD_OPTIONS));

/* eslint-disable no-console */
smith.build(err => {
  if (err) throw err;
  if (BUILD_OPTIONS.watch) {
    console.log('Metalsmith build finished!  Starting webpack-dev-server...');
  } else {
    console.log('Build finished!');
  }
});
