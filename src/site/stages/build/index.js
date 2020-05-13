// Builds the site using Metalsmith as the top-level build runner.
const fs = require('fs-extra');
const path = require('path');

const assets = require('metalsmith-assets');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const filenames = require('metalsmith-filenames');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdownit');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');

const silverSmith = require('./silversmith');

const assetSources = require('../../constants/assetSources');

const registerLiquidFilters = require('../../filters/liquid');
const { getDrupalContent } = require('./drupal/metalsmith-drupal');
const addDrupalPrefix = require('./plugins/add-drupal-prefix');
const addNonceToScripts = require('./plugins/add-nonce-to-scripts');
const addSubheadingsIds = require('./plugins/add-id-to-subheadings');
const checkBrokenLinks = require('./plugins/check-broken-links');
const checkCollections = require('./plugins/check-collections');
const checkForCMSUrls = require('./plugins/check-cms-urls');
const downloadAssets = require('./plugins/download-assets');
const readAssetsFromDisk = require('./plugins/read-assets-from-disk');
const processEntryNames = require('./plugins/process-entry-names');
const createDrupalDebugPage = require('./plugins/create-drupal-debug');
const createEnvironmentFilter = require('./plugins/create-environment-filter');
const createHeaderFooter = require('./plugins/create-header-footer');
const createOutreachAssetsData = require('./plugins/create-outreach-assets-data');
const createReactPages = require('./plugins/create-react-pages');
const createSitemaps = require('./plugins/create-sitemaps');
const downloadDrupalAssets = require('./plugins/download-drupal-assets');
const leftRailNavResetLevels = require('./plugins/left-rail-nav-reset-levels');
const parseHtml = require('./plugins/parse-html');
const replaceContentsWithDom = require('./plugins/replace-contents-with-dom');
const injectAxeCore = require('./plugins/inject-axe-core');
const rewriteDrupalPages = require('./plugins/rewrite-drupal-pages');
const rewriteVaDomains = require('./plugins/rewrite-va-domains');
const updateExternalLinks = require('./plugins/update-external-links');
const updateRobots = require('./plugins/update-robots');

/**
 * Immediately copies the Webpack build output to a directory outside of
 * Metalsmith's build destination, then returns a function for use as a
 * Metalsmith plugin. This plugin copies the files back to their expected
 * location.
 *
 * This is needed because script/build.sh runs Webpack before the content build,
 * and Metalsmith's build method removes everything in the destination, which
 * wipes out the output of the Webpack build.
 *
 * This can be removed when we move the content build to a new repository and
 * this script no longer interacts with the Webpack output at all.
 */
function preserveWebpackOutput(metalsmithDestination, buildType) {
  const webpackBuildDirName = 'generated';
  const tempDir = path.join(
    __dirname,
    '../../../../tmp/',
    buildType,
    webpackBuildDirName,
  );
  const webpackDir = path.join(metalsmithDestination, webpackBuildDirName);

  const webpackDirExists = fs.existsSync(webpackDir);

  // Immediately move the Webpack output to a new directory
  if (webpackDirExists) {
    // eslint-disable-next-line no-console
    console.log(`Found Webpack directory at ${webpackDir}`);
    fs.moveSync(webpackDir, tempDir, { overwrite: true });
  }

  return () => {
    if (webpackDirExists) {
      fs.moveSync(tempDir, webpackDir);
      // Clean up tmp/ if it's empty. The empty check is needed for CI, where
      // we're building multiple environments in parallel
      if (!fs.readdirSync(path.resolve(tempDir, '..')).length) {
        fs.rmdirSync(path.resolve(tempDir, '..'));
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'No Webpack output found. Skipping the asset preservation step.',
      );
    }
  };
}

function build(BUILD_OPTIONS) {
  const smith = silverSmith();

  registerLiquidFilters();

  // Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
  // add comments about any implicit dependencies you are introducing!!!
  //
  smith.source(`${BUILD_OPTIONS.contentPagesRoot}`);
  smith.destination(BUILD_OPTIONS.destination);

  // This lets us access the {{buildtype}} variable within liquid templates.
  smith.metadata({
    buildtype: BUILD_OPTIONS.buildtype,
    hostUrl: BUILD_OPTIONS.hostUrl,
    enabledFeatureFlags: BUILD_OPTIONS.cmsFeatureFlags,
  });

  smith.use(
    preserveWebpackOutput(BUILD_OPTIONS.destination, BUILD_OPTIONS.buildtype),
    'Preserving Webpack build output',
  );

  smith.use(createReactPages(BUILD_OPTIONS), 'Create React pages');
  smith.use(getDrupalContent(BUILD_OPTIONS), 'Get Drupal content');
  smith.use(addDrupalPrefix(BUILD_OPTIONS), 'Add Drupal Prefix');
  smith.use(
    createOutreachAssetsData(BUILD_OPTIONS),
    'Create Outreach Assets Data',
  );

  smith.use(
    createEnvironmentFilter(BUILD_OPTIONS),
    'Create environment filter',
  );

  // This adds the filename into the "entry" that is passed to other plugins. Without this errors
  // during templating end up not showing which file they came from. Load it very early in in the
  // plugin chain.
  smith.use(filenames(), 'Add filenames for debugging');

  smith.use(checkCollections(BUILD_OPTIONS), 'Check collections');
  smith.use(collections(BUILD_OPTIONS.collections), 'Group collections');
  smith.use(leftRailNavResetLevels(), 'Reset left rail navigation menu levels');
  smith.use(dateInFilename(true), 'Add the date to filenames');
  smith.use(assets(BUILD_OPTIONS.fontAssets), 'Add font assets');
  smith.use(assets(BUILD_OPTIONS.imageAssets), 'Add image assets');
  smith.use(assets(BUILD_OPTIONS.contentAssets), 'Add content assets');
  smith.use(assets(BUILD_OPTIONS.textAssets), 'Add text assets');

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
  smith.use(
    inPlace({ engine: 'liquid', pattern: '*.{md,html}' }),
    'Plug the content into the templates',
  );
  smith.use(
    markdown({
      typographer: true,
      html: true,
    }),
    'Translate the markdown to html',
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
    'Add permalinks and change foo.md to foo/index.html',
  );

  smith.use(createHeaderFooter(BUILD_OPTIONS), 'Create header and footer');

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
    'Generate navigation',
  );

  smith.use(
    layouts({
      engine: 'liquid',
      directory: BUILD_OPTIONS.layouts,
      // Only apply layouts to markdown and html files.
      pattern: '**/*.{md,html}',
    }),
    'Apply layouts',
  );

  /*
  * This will replace links in static pages with a staging domain,
  * if it is in the list of domains to replace
  */
  smith.use(
    rewriteVaDomains(BUILD_OPTIONS),
    'Rewrite VA domains for the buildtype',
  );
  smith.use(rewriteDrupalPages(BUILD_OPTIONS), 'Rewrite Drupal pages');
  smith.use(createDrupalDebugPage(BUILD_OPTIONS), 'Create Drupal debug page');

  smith.use(downloadDrupalAssets(BUILD_OPTIONS), 'Download Drupal assets');

  if (BUILD_OPTIONS['asset-source'] !== assetSources.LOCAL) {
    // Download the pre-built application assets if needed
    smith.use(downloadAssets(BUILD_OPTIONS), 'Download application assets');
  } else {
    // If the asset-source === 'local', the script/build.sh will run Webpack
    // Load the resulting files from disk
    smith.use(
      readAssetsFromDisk(BUILD_OPTIONS),
      'Read application assets from disk',
    );
  }

  smith.use(createSitemaps(BUILD_OPTIONS), 'Create sitemap');
  smith.use(updateRobots(BUILD_OPTIONS), 'Update robots.txt');
  smith.use(checkForCMSUrls(BUILD_OPTIONS), 'Check for CMS URLs');

  /**
   * Parse the HTML into a JS data structure for use in later plugins.
   * Important: Only plugins that use the parsedContent to modify the
   * content can go between the parseHtml and outputHtml plugins. If
   * the content is modified directly between those two plugins, any
   * changes will be overwritten during the outputHtml step.
   */
  smith.use(parseHtml, 'Parse HTML files');

  /**
   * Add nonce attribute with substition string to all inline script tags
   * Convert onclick event handles into nonced script tags
   */
  smith.use(addNonceToScripts, 'Add nonce to script tags');
  smith.use(
    processEntryNames(BUILD_OPTIONS),
    'Process [data-entry-name] attributes into Webpack asset paths',
  );
  smith.use(updateExternalLinks(BUILD_OPTIONS), 'Update external links');
  smith.use(addSubheadingsIds(BUILD_OPTIONS), 'Add IDs to subheadings');
  smith.use(checkBrokenLinks(BUILD_OPTIONS), 'Check for broken links');
  smith.use(injectAxeCore(BUILD_OPTIONS), 'Inject axe-core for accessibility');
  smith.use(replaceContentsWithDom, 'Save the changes from the modified DOM');

  /* eslint-disable no-console */
  smith.build(err => {
    if (err) throw err;
    if (BUILD_OPTIONS.watch) {
      console.log('Metalsmith build finished!');
    } else {
      smith.printSummary();
      console.log('Build finished!');
    }
  });
}

module.exports = build;
