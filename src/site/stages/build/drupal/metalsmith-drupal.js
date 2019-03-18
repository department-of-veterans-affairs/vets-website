/* eslint-disable no-param-reassign, no-continue */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const recursiveRead = require('recursive-readdir');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');
const convertDrupalFilesToLocal = require('./assets');
const { compilePage, createFileObj } = require('./page');
const createHealthCareRegionListPages = require('./health-care-region');

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

function writeDrupalDebugPage(files) {
  log('Drupal debug page written to /drupal/debug.');

  const drupalPages = Object.keys(files)
    .filter(page => page.startsWith('drupal'))
    .map(page => `<li><a href="/${page}">/${page}</a></li>`)
    .join('');

  const drupalIndex = `
    <h1>The following pages were provided by Drupal:</h1>
    <ol>${drupalPages}</ol>
  `;

  files['drupal/debug/index.html'] = {
    contents: Buffer.from(drupalIndex),
  };
}

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
    },
  } = contentData;

  for (const page of pages) {
    // At this time, null values are returned for pages that are not yet published.
    // Once the Content-Preview server is up and running, then unpublished pages should
    // reliably return like any other page and we can delete this.
    if (!page) {
      log('Skipping null entity...');
      continue;
    }

    if (!Object.keys(page).length) {
      log('Skipping empty entity...');
      continue;
    }

    const {
      entityUrl: { path: drupalPagePath },
      entityBundle,
    } = page;

    const pageCompiled = compilePage(page, contentData);

    files[`drupal${drupalPagePath}/index.html`] = createFileObj(
      pageCompiled,
      `${entityBundle}.drupal.liquid`,
    );

    if (page.entityBundle === 'health_care_region_page') {
      createHealthCareRegionListPages(pageCompiled, drupalPagePath, files);
    }
  }

  writeDrupalDebugPage(files);
  files[`drupal/index.md`] = {
    ...files['index.md'],
    path: 'drupal/index.html',
    isDrupalPage: true,
    private: true,
  };
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
      fs.emptyDirSync(path.join(buildOptions.cacheDirectory, 'drupalFiles'));
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

async function loadCachedDrupalFiles(buildOptions, files) {
  const cachedFilesPath = path.join(buildOptions.cacheDirectory, 'drupalFiles');
  if (!buildOptions[PULL_DRUPAL_BUILD_ARG] && fs.existsSync(cachedFilesPath)) {
    const cachedDrupalFiles = await recursiveRead(cachedFilesPath);
    cachedDrupalFiles.forEach(file => {
      const relativePath = path.relative(
        path.join(buildOptions.cacheDirectory, 'drupalFiles'),
        file,
      );
      files[relativePath] = {
        path: relativePath,
        isDrupalAsset: true,
        contents: fs.readFileSync(file),
      };
    });
  }
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
      drupalData = convertDrupalFilesToLocal(drupalData, files, buildOptions);
      loadCachedDrupalFiles(buildOptions, files);
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
