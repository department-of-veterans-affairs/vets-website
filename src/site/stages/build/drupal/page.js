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

function compilePage(page, contentData) {
  const {
    data: {
      sidebarQuery: sidebarNav = {},
      alerts: alertsItem = {},
      facilitySidebarQuery: facilitySidebarNav = {},
    },
  } = contentData;

  const sidebarNavItems = { sidebar: sidebarNav };
  const facilitySidebarNavItems = { facilitySidebar: facilitySidebarNav };
  const alertItems = { alert: alertsItem };

  const { entityUrl, entityBundle } = page;

  const pageIdRaw = parseInt(page.entityId, 10);
  const pageId = { pid: pageIdRaw };
  let pageCompiled;

  switch (entityBundle) {
    case 'library':
      pageCompiled = Object.assign(
        {},
        page,
        facilitySidebarNavItems,
        alertItems,
        pageId,
      );
      break;

    case 'health_care_region_detail_page':
      pageCompiled = Object.assign(
        {},
        page,
        facilitySidebarNavItems,
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
      // eslint-disable-next-line no-param-reassign
      page.entityUrl = generateBreadCrumbs(entityUrl.path);
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    }
    case 'person_profile':
      page.entityUrl = generateBreadCrumbs(entityUrl.path);
      pageCompiled = Object.assign(
        page,
        facilitySidebarNavItems,
        alertItems,
        pageId,
      );
      break;
    default:
      pageCompiled = Object.assign(
        {},
        page,
        sidebarNavItems,
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
};
