/* eslint-disable no-param-reassign, no-continue */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');
const facilityLocationPath = require('./utilities-drupal');

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

// Creates the file object to add to the file list using the page and layout
function createFileObj(page, layout) {
  return {
    ...page,
    isDrupalPage: true,
    layout,
    contents: Buffer.from('<!-- Drupal-provided data -->'),
    debug: JSON.stringify(page, null, 4),
    // Keep these pages out of the sitemap until we remove
    // the drupal prefix
    private: true,
  };
}

function paginationPath(pageNum) {
  return pageNum === 0 ? '' : `/page-${pageNum + 1}`;
}

// Turn one big page into a series of paginated pages.
function paginatePages(
  page,
  pagePath,
  files,
  field,
  layout,
  ariaLabel,
  perPage,
) {
  perPage = perPage || 10;

  if (typeof ariaLabel === 'undefined') {
    ariaLabel = '';
  } else {
    ariaLabel = ` of ${ariaLabel}`;
  }

  const pagedEntities = _.chunk(page[field].entities, perPage);
  for (let pageNum = 0; pageNum < pagedEntities.length; pageNum++) {
    const pagedPage = Object.assign({}, page);
    pagedPage.pagedItems = pagedEntities[pageNum];
    const innerPages = [];

    if (pagedEntities.length > 1) {
      // add page numbers
      const numPageLinks = 3;
      let start;
      let length;
      if (pagedEntities.length <= numPageLinks) {
        start = 0;
        length = pagedEntities.length;
      } else {
        length = numPageLinks;

        if (pageNum + numPageLinks > pagedEntities.length) {
          start = pagedEntities.length - numPageLinks;
        } else {
          start = pageNum;
        }
      }
      for (let num = start; num < start + length; num++) {
        innerPages.push({
          href: num === pageNum ? null : `${pagePath}${paginationPath(num)}`,
          label: num + 1,
          class: num === pageNum ? 'va-pagination-active' : '',
        });
      }

      pagedPage.paginator = {
        ariaLabel,
        prev: pageNum > 0 ? `${pagePath}${paginationPath(pageNum - 1)}` : null,
        inner: innerPages,
        next:
          pageNum < pagedEntities.length - 1
            ? `${pagePath}${paginationPath(pageNum + 1)}`
            : null,
      };
    }

    files[
      `drupal${pagePath}${paginationPath(pageNum)}/index.html`
    ] = createFileObj(pagedPage, layout);
  }
}

// Creates the top-level health care region list pages (Locations, Services, etc.)
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  // Create the top-level locations page for Health Care Regions
  files[`drupal${drupalPagePath}/locations/index.html`] = createFileObj(
    page,
    'health_care_region_locations_page.drupal.liquid',
  );

  paginatePages(
    page,
    `${drupalPagePath}/press-releases`,
    files,
    'allPressReleaseTeasers',
    'press_releases_page.drupal.liquid',
    'press releases',
  );

  const relatedLinks = { fieldRelatedLinks: page.fieldRelatedLinks };

  // Create the detail page for healthcare local facilities
  if (page.mainFacilities !== undefined || page.otherFacilities !== undefined) {
    for (const facility of [
      ...page.mainFacilities.entities,
      ...page.otherFacilities.entities,
    ]) {
      if (facility.entityBundle === 'health_care_local_facility') {
        const facilityCompiled = Object.assign(facility, relatedLinks);

        const pagePath = facilityLocationPath(
          drupalPagePath,
          facility.fieldFacilityLocatorApiId,
          facility.fieldNicknameForThisFacility,
        );
        files[`drupal${pagePath}/index.html`] = createFileObj(
          facilityCompiled,
          'health_care_local_facility_page.drupal.liquid',
        );
      }
    }
  }

  files[`drupal${drupalPagePath}/health-services/index.html`] = createFileObj(
    page,
    'health_care_region_health_services_page.drupal.liquid',
  );
}

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
      sidebarQuery: sidebarNav,
    },
  } = contentData;

  const sidebarNavItems = { sidebar: sidebarNav };

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

    let pageCompiled;

    if (entityBundle === 'page') {
      pageCompiled = Object.assign(page, sidebarNavItems);
    } else {
      pageCompiled = page;
    }

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
