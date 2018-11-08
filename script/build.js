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
const moveRemove = require('metalsmith-move-remove');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');

const generateRedirectedPages = require('./vets-gov-to-va-gov');
const createBuildSettings = require('./create-build-settings');
const createRedirects = require('./create-redirects');
const createSitemaps = require('./create-sitemaps');
const updateExternalLinks = require('./update-external-links');
const createEnvironmentFilter = require('./create-environment-filter');
const nonceTransformer = require('./metalsmith/nonceTransformer');
const leftRailNavResetLevels = require('./left-rail-nav-reset-levels');
const checkBrokenLinks = require('./check-broken-links');
const rewriteVaDomains = require('./rewrite-va-domains');
const configureAssets = require('./configure-assets');
const applyFragments = require('./apply-fragments');

function defaultBuild(BUILD_OPTIONS) {
  const smith = Metalsmith(__dirname); // eslint-disable-line new-cap

  // Custom liquid filter(s)
  liquid.filters.humanizeDate = dt => moment(dt).format('MMMM D, YYYY');

  // Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
  // add comments about any implicit dependencies you are introducing!!!
  //
  smith.source(`${BUILD_OPTIONS.contentPagesRoot}`);
  smith.destination(BUILD_OPTIONS.destination);

  // This lets us access the {{buildtype}} variable within liquid templates.
  smith.metadata({
    buildtype: BUILD_OPTIONS.buildtype,
    hostUrl: BUILD_OPTIONS.hostUrl,
    mergedbuild: !!BUILD_OPTIONS['brand-consolidation-enabled'], // @deprecated - We use a separate Metalsmith directory for VA.gov. We shouldn't ever need this info in Metalsmith files.
  });

  smith.use(createEnvironmentFilter(BUILD_OPTIONS));

  // This adds the filename into the "entry" that is passed to other plugins. Without this errors
  // during templating end up not showing which file they came from. Load it very early in in the
  // plugin chain.
  smith.use(filenames());

  if (BUILD_OPTIONS.contentFragments) {
    smith.use(applyFragments(BUILD_OPTIONS));
  }

  smith.use(collections(BUILD_OPTIONS.collections));
  smith.use(leftRailNavResetLevels());
  smith.use(dateInFilename(true));

  smith.use(assets(BUILD_OPTIONS.appAssets));
  if (BUILD_OPTIONS.contentAssets) {
    smith.use(assets(BUILD_OPTIONS.contentAssets));
  }

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

  smith.use(updateExternalLinks(BUILD_OPTIONS));

  configureAssets(smith, BUILD_OPTIONS);

  smith.use(createSitemaps(BUILD_OPTIONS));
  smith.use(createRedirects(BUILD_OPTIONS));
  smith.use(checkBrokenLinks(BUILD_OPTIONS));
  smith.use(moveRemove(BUILD_OPTIONS));

  /* eslint-disable no-console */
  smith.build(err => {
    if (err) throw err;
    if (BUILD_OPTIONS.watch) {
      console.log('Metalsmith build finished!  Starting webpack-dev-server...');
    } else {
      console.log('Build finished!');
    }
  });
}

function main() {
  const BUILD_OPTIONS = require('./options');
  if (BUILD_OPTIONS['vets-gov-to-va-gov']) {
    generateRedirectedPages(BUILD_OPTIONS);
  } else {
    defaultBuild(BUILD_OPTIONS);
  }
}

main();
