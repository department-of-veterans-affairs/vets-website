/* eslint-disable no-param-reassign */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');
const GET_ALL_PAGES = require('./get-all-pages.graphql');

const DRUPAL_CACHE_FILENAME = 'drupal.json';

// If "--pull-drupal" is passed into the build args, then the build
// should pull the latest Drupal data.
const SHOULD_PULL_DRUPAL_BUILD_ARG = 'pull-drupal';

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
]);

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);

// eslint-disable-next-line no-console
const log = message => console.log(DRUPAL_COLORIZED_OUTPUT(message));

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
    },
  } = contentData;

  let drupalIndexPage =
    '<h1>The following pages were provided by Drupal:</h1><ol>\n';

  for (const page of pages) {
    const {
      entityUrl: { path: drupalPagePath },
    } = page;

    const jsonPath = `drupal${drupalPagePath}.json`;

    drupalIndexPage += `<li><a href="/${jsonPath}">${drupalPagePath}</a></li>`;

    files[jsonPath] = {
      ...page,
      contents: Buffer.from(JSON.stringify(page, null, 4)),
    };
  }

  drupalIndexPage += '</ol>';

  files['drupal/index.html'] = {
    contents: Buffer.from(drupalIndexPage),
  };

  log('Drupal index page written to /drupal.');
}

async function loadDrupal(buildOptions) {
  const drupalCache = path.join(
    buildOptions.cacheDirectory,
    DRUPAL_CACHE_FILENAME,
  );
  const isDrupalAvailableInCache = fs.existsSync(drupalCache);

  let shouldPullDrupal = buildOptions[SHOULD_PULL_DRUPAL_BUILD_ARG];
  let drupalPages = null;

  if (!isDrupalAvailableInCache) {
    log('Drupal unavailable in cache');
    shouldPullDrupal = true;
  }

  if (shouldPullDrupal) {
    log('Attempting to load content from Drupal API...');

    const contentApi = getApiClient(buildOptions);

    drupalPages = await contentApi.query({ query: GET_ALL_PAGES });

    if (buildOptions.buildtype === ENVIRONMENTS.LOCALHOST) {
      const serialized = Buffer.from(JSON.stringify(drupalPages, null, 2));
      fs.ensureDirSync(buildOptions.cacheDirectory);
      fs.writeFileSync(drupalCache, serialized);
    }
  } else {
    log('Attempting to load content from cache...');

    // eslint-disable-next-line import/no-dynamic-require
    drupalPages = require(drupalCache);
  }

  log('Content successfully loaded!');
  return drupalPages;
}

function getDrupalContent(buildOptions) {
  if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
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
    } catch (err) {
      log('Failed to pipe Drupal into Metalsmith!');
      done(err);
    }
    log('Successfully piped Drupal into Metalsmith!');
    done();
  };
}

module.exports = getDrupalContent;
