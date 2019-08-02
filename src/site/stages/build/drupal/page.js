/* eslint-disable no-param-reassign, no-continue */
const path = require('path');
const _ = require('lodash');
const set = require('lodash/fp/set');

// Creates the file object to add to the file list using the page and layout
function createFileObj(page, layout) {
  // Exclude some types from sitemap.
  const privateTypes = ['outreach_asset', 'support_service'];
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

// Return a default entityUrl obj to to work from
function createEntityUrlObj(pagePath) {
  return {
    breadcrumb: [
      {
        url: { path: '/', routed: true },
        text: 'Home',
      },
    ],
    path: pagePath,
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
    let pagedPage = Object.assign({}, page);

    if (pageNum > 0) {
      pagedPage = set(
        'entityUrl.path',
        `${page.entityUrl.path}${paginationPath(pageNum)}`,
        page,
      );
    }

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

    const fileName = path.join('.', pagedPage.entityUrl.path, 'index.html');

    files[fileName] = createFileObj(pagedPage, layout);
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
  const absolutePath = path.join('/', drupalPagePath, pathSuffix);

  generatedPage.entityUrl.breadcrumb = [
    ...page.entityUrl.breadcrumb,
    {
      url: { path: absolutePath },
      text: page.title,
    },
  ];

  generatedPage = set('entityUrl.path', absolutePath, page);

  generatedPage.title = title;
  return generatedPage;
}

// Generate breadcrumbs from drupal page path
function generateBreadCrumbs(pathString) {
  const pathArray = pathString.split('/');
  const entityUrlObj = createEntityUrlObj(pathString);
  let previous = '';
  let trimmedValue;

  for (const value of pathArray) {
    trimmedValue = _.trim(value, '/');
    if (value) {
      const dehandlized =
        value === 'pittsburgh-health-care'
          ? 'VA Pittsburgh health care'
          : _.startCase(_.trim(value, '-'));
      entityUrlObj.breadcrumb.push({
        url: {
          path: `${previous}${value}`,
          routed: true,
        },
        text: dehandlized,
      });
    }
    previous += `${trimmedValue}/`;
  }

  return entityUrlObj;
}

function getHubSidebar(navsArray, owner) {
  // Get the right benefits hub sidebar
  for (const nav of navsArray) {
    if (nav !== null && nav.links.length) {
      const navName = _.toLower(nav.name.replace(/&/g, 'and'));
      if (owner !== null && owner === navName) {
        return { sidebar: nav };
      }
    }
  }

  // default to no menu
  return { sidebar: {} };
}

function compilePage(page, contentData) {
  const {
    data: {
      healthcareHubSidebarQuery: healthcareHubSidebarNav = {},
      recordsHubSidebarQuery: recordsHubSidebarNav = {},
      pensionHubSidebarQuery: pensionHubSidebarNav = {},
      careersHubSidebarQuery: careersHubSidebarNav = {},
      housingHubSidebarQuery: housingHubSidebarNav = {},
      lifeInsuranceHubSidebarQuery: lifeInsuranceHubSidebarNav = {},
      alerts: alertsItem = {},
      facilitySidebarQuery: facilitySidebarNav = {},
      outreachSidebarQuery: outreachSidebarNav = {},
    },
  } = contentData;

  // Get page owner
  let owner;
  if (page.fieldAdministration) {
    owner = _.toLower(page.fieldAdministration.entity.name);
  }
  // Benefits hub side navs in an array to loop through later
  const sideNavs = [
    healthcareHubSidebarNav,
    recordsHubSidebarNav,
    pensionHubSidebarNav,
    careersHubSidebarNav,
    housingHubSidebarNav,
    lifeInsuranceHubSidebarNav,
  ];
  let sidebarNavItems;

  const facilitySidebarNavItems = { facilitySidebar: facilitySidebarNav };
  const outreachSidebarNavItems = { outreachSidebar: outreachSidebarNav };
  const alertItems = { alert: alertsItem };

  const { entityUrl, entityBundle } = page;

  const pageIdRaw = parseInt(page.entityId, 10);
  const pageId = { pid: pageIdRaw };

  if (!('breadcrumb' in entityUrl)) {
    page.entityUrl = generateBreadCrumbs(entityUrl.path);
  }

  let pageCompiled;

  switch (entityBundle) {
    case 'office':
    case 'publication_listing':
    case 'event_listing':
      pageCompiled = Object.assign(
        {},
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;

    case 'health_care_region_detail_page':
      pageCompiled = Object.assign(
        {},
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    case 'health_care_local_facility':
      pageCompiled = Object.assign(
        {},
        page,
        facilitySidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    case 'health_care_region_page':
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    case 'news_story':
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    case 'press_release':
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    case 'event': {
      // eslint-disable-next-line no-param-reassign
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    }
    case 'person_profile':
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    default:
      // Get the right benefits hub sidebar
      sidebarNavItems = getHubSidebar(sideNavs, owner);

      // Build page with correct sidebar
      pageCompiled = Object.assign(
        {},
        page,
        sidebarNavItems,
        outreachSidebarNavItems,
        alertItems,
        pageId,
      );
      break;
  }

  return pageCompiled;
}

module.exports = {
  compilePage,
  createFileObj,
  paginatePages,
  createEntityUrlObj,
  updateEntityUrlObj,
  generateBreadCrumbs,
};
