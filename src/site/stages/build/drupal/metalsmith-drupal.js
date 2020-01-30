/* eslint-disable no-param-reassign, no-continue, no-console */

const fs = require('fs-extra');
const path = require('path');
const recursiveRead = require('recursive-readdir');

const ENVIRONMENTS = require('../../../constants/environments');
const { ENABLED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal: log } = require('./utilities-drupal');
const getApiClient = require('./api');
const convertDrupalFilesToLocal = require('./assets');
const { compilePage, createFileObj } = require('./page');
const {
  createHealthCareRegionListPages,
  addGetUpdatesFields,
  modListPages,
} = require('./health-care-region');
const { addHubIconField } = require('./benefit-hub');
const { addHomeContent } = require('./home');

const DRUPAL_CACHE_FILENAME = 'drupal/pages.json';
const DRUPAL_HUB_NAV_FILENAME = 'hubNavNames.json';

// If "--pull-drupal" is passed into the build args, then the build
// should pull the latest Drupal data.
const PULL_DRUPAL_BUILD_ARG = 'pull-drupal';
// If "--use-cms-export" is passed into the build args, then the build
// should use the files in the tome-sync export directory
const USE_CMS_EXPORT_BUILD_ARG = 'use-cms-export';

// We need to pull the Drupal content if we have --pull-drupal or --use-cms-export, OR if
// the content is not available in the cache.
const shouldPullDrupal = buildOptions => {
  const drupalCache = path.join(
    buildOptions.cacheDirectory,
    DRUPAL_CACHE_FILENAME,
  );
  const isDrupalAvailableInCache = fs.existsSync(drupalCache);
  return (
    buildOptions[PULL_DRUPAL_BUILD_ARG] ||
    buildOptions[USE_CMS_EXPORT_BUILD_ARG] ||
    (!isDrupalAvailableInCache &&
      buildOptions.buildtype !== ENVIRONMENTS.LOCALHOST) // Don't require a cache to build locally.
  );
};

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
    },
  } = contentData;

  const skippedContent = {
    nullEntities: 0,
    emptyEntities: 0,
  };

  for (const page of pages) {
    // At this time, null values are returned for pages that are not yet published.
    // Once the Content-Preview server is up and running, then unpublished pages should
    // reliably return like any other page and we can delete this.
    if (!page) {
      skippedContent.nullEntities++;
      continue;
    }

    if (!Object.keys(page).length) {
      skippedContent.emptyEntities++;
      continue;
    }

    const {
      entityUrl: { path: drupalUrl },
      entityBundle,
    } = page;

    const pageCompiled = compilePage(page, contentData);
    const drupalPageDir = path.join('.', drupalUrl);
    const drupalFileName = path.join(drupalPageDir, 'index.html');

    switch (page.entityBundle) {
      case 'health_care_local_facility':
        addGetUpdatesFields(pageCompiled, pages);
        break;
      case 'health_care_region_detail_page':
        addGetUpdatesFields(pageCompiled, pages);
        break;
      case 'event_listing':
        modListPages(
          pageCompiled,
          pages,
          files,
          page.allEventTeasers,
          'event_listing.drupal.liquid',
          'event',
        );
        break;
      case 'story_listing':
        modListPages(
          pageCompiled,
          pages,
          files,
          page.allNewsStoryTeasers,
          'story_listing.drupal.liquid',
          'story',
        );
        break;
      case 'page':
        addHubIconField(pageCompiled, pages);
        break;
      default:
    }

    files[drupalFileName] = createFileObj(
      pageCompiled,
      `${entityBundle}.drupal.liquid`,
    );

    if (page.entityBundle === 'health_care_region_page') {
      createHealthCareRegionListPages(pageCompiled, drupalPageDir, files);
    }
  }

  if (skippedContent.nullEntities) {
    log(`Skipped ${skippedContent.nullEntities} null entities`);
  }
  if (skippedContent.emptyEntities) {
    log(`Skipped ${skippedContent.emptyEntities} empty entities`);
  }

  addHomeContent(contentData, files);
}

async function loadDrupal(buildOptions) {
  const contentApi = getApiClient(buildOptions);
  const drupalCache = path.join(
    buildOptions.cacheDirectory,
    DRUPAL_CACHE_FILENAME,
  );
  const drupalHubMenuNames = path.join(
    buildOptions.paramsDirectory,
    DRUPAL_HUB_NAV_FILENAME,
  );

  const isDrupalAvailableInCache = fs.existsSync(drupalCache);

  const shouldPull = shouldPullDrupal(buildOptions);
  let drupalPages = null;

  if (!isDrupalAvailableInCache) {
    log(`Drupal content unavailable in local cache: ${drupalCache}`);
  } else {
    log(`Drupal content cache found: ${drupalCache}`);
  }

  if (shouldPull) {
    log(
      `Attempting to load Drupal content from API at ${contentApi.getSiteUri()}`,
    );

    const drupalTimer = `${contentApi.getSiteUri()} response time: `;

    console.time(drupalTimer);

    if (buildOptions[USE_CMS_EXPORT_BUILD_ARG]) {
      drupalPages = await contentApi.getNonNodeContent();
      drupalPages.data.nodeQuery = {
        entities: contentApi.getExportedPages(),
      };
    } else {
      drupalPages = await contentApi.getAllPages();
    }

    console.timeEnd(drupalTimer);

    if (drupalPages.errors && drupalPages.errors.length) {
      log(JSON.stringify(drupalPages.errors, null, 2));
      throw new Error('Drupal query returned with errors');
    }

    fs.outputJsonSync(drupalCache, drupalPages, { spaces: 2 });

    if (drupalPages.data.allSideNavMachineNamesQuery) {
      fs.outputJsonSync(
        drupalHubMenuNames,
        drupalPages.data.allSideNavMachineNamesQuery,
        { spaces: 2 },
      );
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
  const cachedFilesPath = path.join(
    buildOptions.cacheDirectory,
    'drupal/downloads',
  );
  if (!buildOptions[PULL_DRUPAL_BUILD_ARG] && fs.existsSync(cachedFilesPath)) {
    const cachedDrupalFiles = await recursiveRead(cachedFilesPath);
    cachedDrupalFiles.forEach(file => {
      const relativePath = path.relative(
        path.join(buildOptions.cacheDirectory, 'drupal/downloads'),
        file,
      );
      log(`Loaded Drupal asset from cache: ${relativePath}`);
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

      await loadCachedDrupalFiles(buildOptions, files);
      pipeDrupalPagesIntoMetalsmith(drupalData, files);
      log('Successfully piped Drupal content into Metalsmith!');
      buildOptions.drupalData = drupalData;
      done();
    } catch (err) {
      if (err instanceof ReferenceError) throw err;

      buildOptions.drupalError = drupalData;
      log(err.stack);
      log('Failed to pipe Drupal content into Metalsmith!');
      if (
        buildOptions.buildtype !== ENVIRONMENTS.LOCALHOST ||
        buildOptions['drupal-fail-fast']
      ) {
        done(err);
      } else {
        done();
      }
    }
  };
}

module.exports = { getDrupalContent, shouldPullDrupal };
