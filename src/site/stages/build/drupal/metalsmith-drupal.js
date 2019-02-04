/* eslint-disable no-param-reassign, no-continue */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');

const DRUPAL_CACHE_FILENAME = 'drupal.json';

// If "--pull-drupal" is passed into the build args, then the build
// should pull the latest Drupal data.
const PULL_DRUPAL_BUILD_ARG = 'pull-drupal';

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
  ENVIRONMENTS.VAGOVSTAGING,
]);

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);

// eslint-disable-next-line no-console
const log = message => console.log(DRUPAL_COLORIZED_OUTPUT(message));

function writeDrupalIndexPage(files) {
  log('Drupal index page written to /drupal.');

  const drupalPages = Object.keys(files)
    .filter(page => page.startsWith('drupal'))
    .map(page => `<li><a href="/${page}">/${page}</a></li>`)
    .join('');

  const drupalIndex = `
    <h1>The following pages were provided by Drupal:</h1>
    <ol>${drupalPages}</ol>
  `;

  files['drupal/index.html'] = {
    contents: Buffer.from(drupalIndex),
  };
}

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
      taxonomyTermQuery: { entities: taxonomies },
    },
  } = contentData;

  const navItems = [];

  for (const page of pages) {
    // At this time, null values are returned for pages that are not yet published.
    // Once the Content-Preview server is up and running, then unpublished pages should
    // reliably return like any other page and we can delete this.
    if (!page) {
      log('Skipping null entity...');
      continue;
    }

    const {
      entityUrl: { path: drupalPagePath },
      entityBundle,
    } = page;

    files[`drupal${drupalPagePath}/index.html`] = {
      ...page,
      layout: `${entityBundle}.drupal.liquid`,
      contents: Buffer.from('<!-- Drupal-provided data -->'),
      debug: JSON.stringify(page, null, 4),
      // Keep these pages out of the sitemap until we remove
      // the drupal prefix
      private: true,
    };
  }

  // Collect sidebar items
  for (const navItem of taxonomies) {
    const { entityBundle, name } = navItem;

    if (name === 'Health Care') {
      navItems[`${entityBundle}`] = navItem;
    }
  }

  files['drupal/sidebar_navigation/index.html'] = {
    ...navItems['sidebar_navigation'],
    layout: 'sidebar_navigation.drupal.liquid',
    contents: Buffer.from('<!-- Drupal-provided data -->'),
    debug: JSON.stringify(navItems['sidebar_navigation'], null, 4),
  };

  writeDrupalIndexPage(files);
}

async function loadDrupal(buildOptions) {
  const drupalCache = path.join(
    buildOptions.cacheDirectory,
    DRUPAL_CACHE_FILENAME,
  );
  const isDrupalAvailableInCache = fs.existsSync(drupalCache);

  let shouldPullDrupal = buildOptions[PULL_DRUPAL_BUILD_ARG];
  let drupalPages = null;

  if (!isDrupalAvailableInCache) {
    log('Drupal content unavailable in cache');
    shouldPullDrupal = true;
  }

  if (shouldPullDrupal) {
    log('Attempting to load Drupal content from API...');

    const contentApi = getApiClient(buildOptions);

    drupalPages = await contentApi.getAllPages();

    if (buildOptions.buildtype === ENVIRONMENTS.LOCALHOST) {
      const serialized = Buffer.from(JSON.stringify(drupalPages, null, 2));
      fs.ensureDirSync(buildOptions.cacheDirectory);
      fs.writeFileSync(drupalCache, serialized);
    }
  } else {
    log('Attempting to load Drupal content from cache...');
    log(`To pull latest, run with "--${PULL_DRUPAL_BUILD_ARG}" flag.`);

    // eslint-disable-next-line import/no-dynamic-require
    drupalPages = require(drupalCache);
  }

  log('Drupal successfully loaded!');
  return drupalPages;
}

function getDrupalContent(buildOptions) {
  if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
    log(`Drupal integration disabled for buildtype ${buildOptions.buildtype}`);
    const noop = () => {};
    return noop;
  }

  // Declared above the middleware scope so that it's cached during the watch task.
  let drupalData = null;

  return async (files, metalsmith, done) => {
    try {
      if (!drupalData) {
        drupalData = await loadDrupal(buildOptions);
      }
      pipeDrupalPagesIntoMetalsmith(drupalData, files);
      log('Successfully piped Drupal content into Metalsmith!');
      done();
    } catch (err) {
      log(err.stack);
      log('Failed to pipe Drupal content into Metalsmith!');
      log('Continuing with build anyway...');
      // done(err);
      done();
    }
  };
}

module.exports = getDrupalContent;
