/* eslint-disable no-param-reassign, no-continue */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const recursiveRead = require('recursive-readdir');
const set = require('lodash/fp/set');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');
const facilityLocationPath = require('./utilities-drupal');
const convertDrupalFilesToLocal = require('./assets');

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
  // Exclude some types from sitemap.
  const privateTypes = ['outreach_asset', 'person_profile', 'support_service'];
  let privStatus = false;
  if (privateTypes.indexOf(page.entityBundle) > -1) {
    privStatus = true;
  }

  return {
    ...page,
    isDrupalPage: true,
    layout,
    contents: Buffer.from('<!-- Drupal-provided data -->'),
    debug: JSON.stringify(page, null, 4),
    private: privStatus,
  };
}

function paginationPath(pageNum) {
  return pageNum === 0 ? '' : `/page-${pageNum + 1}`;
}

// Turn one big page into a series of paginated pages.
function paginatePages(page, files, field, layout, ariaLabel, perPage) {
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
          href:
            num === pageNum
              ? null
              : `${page.entityUrl.path}${paginationPath(num)}`,
          label: num + 1,
          class: num === pageNum ? 'va-pagination-active' : '',
        });
      }

      pagedPage.paginator = {
        ariaLabel,
        prev:
          pageNum > 0
            ? `${page.entityUrl.path}${paginationPath(pageNum - 1)}`
            : null,
        inner: innerPages,
        next:
          pageNum < pagedEntities.length - 1
            ? `${page.entityUrl.path}${paginationPath(pageNum + 1)}`
            : null,
      };
    }

    files[
      `drupal${page.entityUrl.path}${paginationPath(pageNum)}/index.html`
    ] = createFileObj(pagedPage, layout);
  }
}

// Return page object with path, breadcrumb and title set.
function updateEntityUrlObj(page, drupalPagePath, title, pathSuffix) {
  pathSuffix =
    pathSuffix ||
    title
      .replace(/&/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  let generatedPage = Object.assign({}, page);
  generatedPage.entityUrl.breadcrumb = [
    ...page.entityUrl.breadcrumb,
    {
      url: { path: drupalPagePath },
      text: page.title,
    },
  ];
  generatedPage = set(
    'entityUrl.path',
    `${drupalPagePath}/${pathSuffix}`,
    page,
  );

  generatedPage.title = title;
  return generatedPage;
}

// Return a default entityUrl obj to to work from
function createEntityUrlObj(pagePath) {
  return {
    breadcrumb: [
      {
        url: { path: '/drupal/', routed: true },
        text: 'Home',
      },
    ],
    path: pagePath,
  };
}

// Generate breadcrumbs from drupal page path
function generateBreadCrumbs(pathString) {
  const pathArray = _.split(pathString, '/');
  const entityUrlObj = createEntityUrlObj(pathString);
  for (const value of pathArray) {
    if (value) {
      entityUrlObj.breadcrumb.push({
        url: {
          path: `/${value}`,
          routed: true,
        },
        text: _.startCase(_.trim(value, '-')),
      });
    }
  }
  entityUrlObj.breadcrumb.pop();
  return entityUrlObj;
}

// Creates the facility pages
function createHealthCareRegionListPages(page, drupalPagePath, files) {
  const relatedLinks = { fieldRelatedLinks: page.fieldRelatedLinks };
  const sidebar = { facilitySidebar: page.facilitySidebar };
  const alerts = { alert: page.alert };

  // Create the detail page for health care local facilities
  if (page.mainFacilities !== undefined || page.otherFacilities !== undefined) {
    for (const facility of [
      ...page.mainFacilities.entities,
      ...page.otherFacilities.entities,
    ]) {
      if (facility.entityBundle === 'health_care_local_facility') {
        const pagePath = facilityLocationPath(
          drupalPagePath,
          facility.fieldFacilityLocatorApiId,
          facility.fieldNicknameForThisFacility,
        );

        const facilityCompiled = Object.assign(
          facility,
          relatedLinks,
          sidebar,
          alerts,
        );

        files[`drupal${pagePath}/index.html`] = createFileObj(
          facilityCompiled,
          'health_care_local_facility_page.drupal.liquid',
        );
      }
    }
  }

  // Create the top-level locations page for Health Care Regions
  const locEntityUrl = createEntityUrlObj(drupalPagePath);
  const locObj = {
    mainFacilities: page.mainFacilities,
    otherFacilities: page.otherFacilities,
    fieldLocationsIntroBlurb: page.fieldLocationsIntroBlurb,
    facilitySidebar: sidebar,
    entityUrl: locEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const locPage = updateEntityUrlObj(locObj, drupalPagePath, 'Locations');
  files[`drupal${drupalPagePath}/locations/index.html`] = createFileObj(
    locPage,
    'health_care_region_locations_page.drupal.liquid',
  );

  // Create Health Services Page
  const hsEntityUrl = createEntityUrlObj(drupalPagePath);
  const hsObj = {
    specialtyCareHealthServices: page.specialtyCareHealthServices,
    primaryCareHealthServices: page.primaryCareHealthServices,
    mentalHealthServices: page.mentalHealthServices,
    fieldClinicalHealthServi: page.fieldClinicalHealthCareServi,
    facilitySidebar: sidebar,
    entityUrl: hsEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const hsPage = updateEntityUrlObj(hsObj, drupalPagePath, 'Health Services');
  files[`drupal${drupalPagePath}/health-services/index.html`] = createFileObj(
    hsPage,
    'health_care_region_health_services_page.drupal.liquid',
  );

  // Create the patient and family services page
  const fsEntityUrl = createEntityUrlObj(drupalPagePath);
  const fsObj = {
    careCoordinatorPatientFamilyServices:
      page.careCoordinatorPatientFamilyServices,
    socialProgramsPatientFamilyServices:
      page.socialProgramsPatientFamilyServices,
    healthWellnessPatientFamilyServices:
      page.healthWellnessPatientFamilyServices,
    fieldPatientFamilyServicesIn: page.fieldPatientFamilyServicesIn,
    facilitySidebar: sidebar,
    entityUrl: fsEntityUrl,
    alert: page.alert,
    title: page.title,
  };
  const fsPage = updateEntityUrlObj(
    fsObj,
    drupalPagePath,
    'Patient & Family Services',
  );
  files[
    `drupal${drupalPagePath}/patient-family-services/index.html`
  ] = createFileObj(
    fsPage,
    'health_care_region_patient_family_services_page.drupal.liquid',
  );

  // Press Release listing page
  const prEntityUrl = createEntityUrlObj(drupalPagePath);
  const prObj = {
    allPressReleaseTeasers: page.allPressReleaseTeasers,
    facilitySidebar: sidebar,
    entityUrl: prEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const prPage = updateEntityUrlObj(prObj, drupalPagePath, 'Press Releases');
  paginatePages(
    prPage,
    files,
    'allPressReleaseTeasers',
    'press_releases_page.drupal.liquid',
    'press releases',
  );

  // News Story listing page
  const nsEntityUrl = createEntityUrlObj(drupalPagePath);
  const nsObj = {
    allNewsStoryTeasers: page.allNewsStoryTeasers,
    fieldIntroTextNewsStories: page.fieldIntroTextNewsStories,
    facilitySidebar: sidebar,
    entityUrl: nsEntityUrl,
    title: page.title,
    alert: page.alert,
  };
  const nsPage = updateEntityUrlObj(
    nsObj,
    drupalPagePath,
    'Community stories',
    'stories',
  );
  paginatePages(
    nsPage,
    files,
    'allNewsStoryTeasers',
    'news_stories_page.drupal.liquid',
    'news stories',
  );
}

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  const {
    data: {
      nodeQuery: { entities: pages },
      sidebarQuery: sidebarNav = {},
      alerts: alertsItem = {},
      facilitySidebarQuery: facilitySidebarNav = {},
      icsFiles: { entities: icsFiles },
    },
  } = contentData;

  const sidebarNavItems = { sidebar: sidebarNav };
  const facilitySidebarNavItems = { facilitySidebar: facilitySidebarNav };
  const alertItems = { alert: alertsItem };

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

    const pageIdRaw = parseInt(page.entityId, 10);
    const pageId = { pid: pageIdRaw };
    let pageCompiled;

    switch (entityBundle) {
      case 'page':
        pageCompiled = Object.assign(page, sidebarNavItems, alertItems, pageId);
        break;
      case 'health_care_region_page':
        pageCompiled = Object.assign(
          page,
          facilitySidebarNavItems,
          alertItems,
          pageId,
        );
        break;
      case 'news_story':
        pageCompiled = Object.assign(
          page,
          facilitySidebarNavItems,
          alertItems,
          pageId,
        );
        break;
      case 'press_release':
        pageCompiled = Object.assign(
          page,
          facilitySidebarNavItems,
          alertItems,
          pageId,
        );
        break;
      case 'event': {
        let addToCalendar;
        for (const icsFile of icsFiles) {
          if (
            page.fieldAddToCalendar !== null &&
            icsFile.fid === parseInt(page.fieldAddToCalendar.fileref, 10)
          ) {
            addToCalendar = icsFile.url;
          }
        }
        page.entityUrl = generateBreadCrumbs(drupalPagePath);
        pageCompiled = Object.assign(
          page,
          facilitySidebarNavItems,
          alertItems,
          pageId,
          { addToCalendarLink: addToCalendar },
        );
        break;
      }
      default:
        pageCompiled = page;
        break;
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
