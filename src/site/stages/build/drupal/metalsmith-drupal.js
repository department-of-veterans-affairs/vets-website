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
  createPastEventListPages,
  addGetUpdatesFields,
  addPager,
  sortServices,
} = require('./health-care-region');

const { addHubIconField } = require('./benefit-hub');
const { addHomeContent } = require('./home');

const DRUPAL_CACHE_FILENAME = 'drupal/pages.json';
const DRUPAL_HUB_NAV_FILENAME = 'hubNavNames.json';

// If "--pull-drupal" is passed into the build args, then the build
// should pull the latest Drupal data.
const PULL_DRUPAL_BUILD_ARG = 'pull-drupal';
// If "--use-cms-export" is passed into the build args, then the build
// should use the files in the cms-export directory
const USE_CMS_EXPORT_BUILD_ARG = 'use-cms-export';
const CMS_EXPORT_DIR_BUILD_ARG = 'cms-export-dir';

const getDrupalCachePath = buildOptions =>
  buildOptions[USE_CMS_EXPORT_BUILD_ARG]
    ? buildOptions[CMS_EXPORT_DIR_BUILD_ARG]
    : path.join(buildOptions.cacheDirectory, DRUPAL_CACHE_FILENAME);

// We need to pull the Drupal content if we have --pull-drupal or --use-cms-export, OR if
// the content is not available in the cache.
const shouldPullDrupal = buildOptions =>
  buildOptions[PULL_DRUPAL_BUILD_ARG] ||
  (!fs.existsSync(getDrupalCachePath(buildOptions)) &&
    buildOptions.buildtype !== ENVIRONMENTS.LOCALHOST); // Don't require a cache to build locally.

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
        pageCompiled.pastEventTeasers = pageCompiled.pastEvents;
        pageCompiled.allEventTeasers = pageCompiled.reverseFieldListingNode;
        addPager(
          pageCompiled,
          files,
          pageCompiled.allEventTeasers,
          'event_listing.drupal.liquid',
          'event',
        );
        break;
      case 'story_listing':
        pageCompiled.allNewsStoryTeasers = page.reverseFieldListingNode;
        addPager(
          pageCompiled,
          files,
          pageCompiled.allNewsStoryTeasers,
          'story_listing.drupal.liquid',
          'story',
        );
        break;
      case 'press_releases_listing':
        pageCompiled.allPressReleaseTeasers = page.reverseFieldListingNode;
        addPager(
          pageCompiled,
          files,
          pageCompiled.allPressReleaseTeasers,
          'press_releases_listing.drupal.liquid',
          'press_release',
        );
        break;
      case 'health_services_listing':
        pageCompiled.clinicalHealthServices = sortServices(
          pageCompiled.fieldOffice.entity.reverseFieldRegionPageNode.entities,
        );
        break;
      case 'leadership_listing':
        pageCompiled.allStaffProfiles = page.fieldLeadership;
        addPager(
          pageCompiled,
          files,
          pageCompiled.allStaffProfiles,
          'leadership_listing.drupal.liquid',
          'bio',
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
    if (page.entityBundle === 'event_listing') {
      createPastEventListPages(pageCompiled, drupalPageDir, files);
    }
  }

  if (skippedContent.nullEntities) {
    log(`Skipped ${skippedContent.nullEntities} null entities`);
  }
  if (skippedContent.emptyEntities) {
    log(`Skipped ${skippedContent.emptyEntities} empty entities`);
  }
}

/**
 * Uses Drupal content via a new GraphQL query or the cached result of a
 * previous query. This is where the cache is saved.
 *
 * @param {Object} buildOptions
 * @return {Object} - The result of the GraphQL query
 */
async function getContentViaGraphQL(buildOptions) {
  const contentApi = getApiClient(buildOptions);
  const drupalCache = getDrupalCachePath(buildOptions);
  const drupalHubMenuNames = path.join(
    buildOptions.paramsDirectory,
    DRUPAL_HUB_NAV_FILENAME,
  );

  let drupalPages = null;

  if (shouldPullDrupal(buildOptions)) {
    log(
      `Attempting to load Drupal content from API at ${contentApi.getSiteUri()}`,
    );

    const drupalTimer = `${contentApi.getSiteUri()} response time: `;

    console.time(drupalTimer);

    drupalPages = await contentApi.getAllPages();

    console.timeEnd(drupalTimer);

    // Error handling
    if (drupalPages.errors && drupalPages.errors.length) {
      log(JSON.stringify(drupalPages.errors, null, 2));
      throw new Error('Drupal query returned with errors');
    }

    // Save new cache
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

  return drupalPages;
}

/**
 * Use Drupal content via the CMS export. Fetch and untar the CMS export as needed.
 *
 * @param {Object} buildOptions
 * @return {Object} - The transformed content from the cms export
 */
async function getContentFromExport(buildOptions) {
  const contentApi = getApiClient(buildOptions);

  if (shouldPullDrupal(buildOptions)) {
    // TODO: Download and untar the latest content export
    await contentApi.fetchExportContent();
    // TODO: Time the response time and log it
    // May do this as by passing a { log: true } to fetchExportContents
  }

  const drupalPages = await contentApi.getNonNodeContent();
  drupalPages.data.nodeQuery = {
    entities: contentApi.getExportedPages(),
  };

  return drupalPages;
}

async function loadDrupal(buildOptions) {
  const drupalCache = getDrupalCachePath(buildOptions);

  if (!fs.existsSync(drupalCache)) {
    log(`Drupal content unavailable in local cache: ${drupalCache}`);
  } else {
    log(`Drupal content cache found: ${drupalCache}`);
  }

  const drupalPages = buildOptions[USE_CMS_EXPORT_BUILD_ARG]
    ? await getContentFromExport(buildOptions)
    : await getContentViaGraphQL(buildOptions);

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

  return async (files, metalsmith, done) => {
    let drupalData = null;
    try {
      drupalData = await loadDrupal(buildOptions);
      drupalData = convertDrupalFilesToLocal(drupalData, files, buildOptions);

      await loadCachedDrupalFiles(buildOptions, files);
      pipeDrupalPagesIntoMetalsmith(drupalData, files);
      addHomeContent(drupalData, files, metalsmith, buildOptions);
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
