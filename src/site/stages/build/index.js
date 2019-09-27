// Builds the site using Metalsmith as the top-level build runner.
const chalk = require('chalk');
const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const filenames = require('metalsmith-filenames');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdownit');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');

const getOptions = require('./options');
const registerLiquidFilters = require('../../filters/liquid');
const { getDrupalContent } = require('./drupal/metalsmith-drupal');
const addDrupalPrefix = require('./plugins/add-drupal-prefix');
const createBuildSettings = require('./plugins/create-build-settings');
const createRedirects = require('./plugins/create-redirects');
const createSitemaps = require('./plugins/create-sitemaps');
const updateExternalLinks = require('./plugins/update-external-links');
const createEnvironmentFilter = require('./plugins/create-environment-filter');
const addNonceToScripts = require('./plugins/add-nonce-to-scripts');
const leftRailNavResetLevels = require('./plugins/left-rail-nav-reset-levels');
const checkBrokenLinks = require('./plugins/check-broken-links');
const rewriteVaDomains = require('./plugins/rewrite-va-domains');
const rewriteDrupalPages = require('./plugins/rewrite-drupal-pages');
const createDrupalDebugPage = require('./plugins/create-drupal-debug');
const configureAssets = require('./plugins/configure-assets');
const applyFragments = require('./plugins/apply-fragments');
const checkCollections = require('./plugins/check-collections');
const createFeatureToggles = require('./plugins/create-feature-toggles');
const createHeaderFooter = require('./plugins/create-header-footer');
const createReactPages = require('./plugins/create-react-pages');
const downloadDrupalAssets = require('./plugins/download-drupal-assets');
const checkForCMSUrls = require('./plugins/check-cms-urls');
const createOutreachAssetsData = require('./plugins/create-outreach-assets-data');
const addSubheadingsIds = require('./plugins/add-id-to-subheadings');

function defaultBuild(BUILD_OPTIONS) {
  const smith = Metalsmith(__dirname); // eslint-disable-line new-cap

  // Override the normal use function to provide timing and logging information
  smith._use = smith.use;
  let stepCount = 0;
  smith.use = function use(plugin, description) {
    const step = ++stepCount;
    if (!description) return smith._use(plugin);

    let timerStart;

    /* eslint-disable no-console */
    return smith
      ._use(() => {
        console.log(chalk.cyan(`\nStep ${step} start: ${description}`));
        timerStart = process.hrtime.bigint();
      })
      ._use(plugin)
      ._use(() => {
        const time = (process.hrtime.bigint() - timerStart) / 1000000n;

        // Color the time
        let color;
        if (time < 1000) color = chalk.green;
        else if (time < 10000) color = chalk.yellow;
        else color = chalk.red;
        const coloredTime = color(`[${time}ms]`);

        console.log(
          chalk.cyan(`Step ${step} end ${coloredTime}: ${description}`),
        );
      });
    /* eslint-enable no-console */
  };

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

  smith.use(applyFragments(BUILD_OPTIONS), 'Apply template fragments');
  smith.use(checkCollections(BUILD_OPTIONS), 'Check collections');
  smith.use(collections(BUILD_OPTIONS.collections), 'Group collections');
  smith.use(leftRailNavResetLevels(), 'Reset left rail navigation menu levels');
  smith.use(dateInFilename(true), 'Add the date to filenames');
  smith.use(assets(BUILD_OPTIONS.appAssets), 'Add app assets');
  smith.use(assets(BUILD_OPTIONS.contentAssets), 'Add content assets');

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

  smith.use(createFeatureToggles(BUILD_OPTIONS), 'Create feature toggles');
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
  Add nonce attribute with substition string to all inline script tags
  Convert onclick event handles into nonced script tags
  */
  smith.use(addNonceToScripts, 'Add nonce to script tags');

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

  // Create the data passed from the content build to the assets compiler.
  // On the server, it can be accessed at BUILD_OPTIONS.buildSettings.
  // In the browser, it can be accessed at window.settings.
  smith.use(createBuildSettings(BUILD_OPTIONS), 'Create build settings');

  smith.use(updateExternalLinks(BUILD_OPTIONS), 'Update external links');
  smith.use(addSubheadingsIds(BUILD_OPTIONS), 'Add IDs to subheadings');
  smith.use(downloadDrupalAssets(BUILD_OPTIONS), 'Download Drupal assets');

  configureAssets(smith, BUILD_OPTIONS);

  smith.use(createSitemaps(BUILD_OPTIONS), 'Create sitemap');
  smith.use(createRedirects(BUILD_OPTIONS), 'Create redirects');
  smith.use(checkBrokenLinks(BUILD_OPTIONS), 'Check for broken links');
  smith.use(checkForCMSUrls(BUILD_OPTIONS), 'Check for CMS URLs');

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

async function main() {
  const buildOptions = await getOptions();
  defaultBuild(buildOptions);
}

module.exports = main;
