import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import findIndex from 'lodash/findIndex';
import {
  getActiveExpandedPages,
  createFormPageList,
  createPageList,
} from './helpers';
import validateConfig from './validate-config';

import FormPage from './containers/FormPage';
import ReviewPage from './review/ReviewPage';
/*
 * Returns the page list without conditional pages that have not satisfied
 * their dependencies and therefore should be skipped.
 */
export function getEligiblePages(pageList, data, pathname) {
  const eligiblePageList = getActiveExpandedPages(pageList, data);
  const pageIndex = findIndex(eligiblePageList, item => item.path === pathname);
  return { pages: eligiblePageList, pageIndex };
}

export function getNextPagePath(pageList, data, pathname) {
  const { pages, pageIndex } = getEligiblePages(pageList, data, pathname);
  return pages[pageIndex + 1].path;
}

export function getPreviousPagePath(pageList, data, pathname) {
  const { pages, pageIndex } = getEligiblePages(pageList, data, pathname);
  // if we found the current page, go to previous one
  // if not, go back to the beginning because they shouldn’t be here
  const page = pageIndex >= 0 ? pageIndex - 1 : 0;
  return pages[page].path;
}

/**
 * Checks if the passed in pathname is a valid path within the form's active
 * pages.
 * @param {Array} pageList - Array of all pages within a form
 * @param {Object} data - All data specific to the form
 * @param {String} pathname - the pathname to test
 * @returns {Boolean}
 */
export function checkValidPagePath(pageList, data, pathname) {
  // ignore search parameters for custom pages goToPath
  const name = (pathname || '').split('?')[0];
  return getActiveExpandedPages(pageList, data).some(
    page => page.path === name,
  );
}

/*
 * Create the routes based on a form config. This goes through each chapter in a form
 * config, pulls out the config for each page, then generates a list of Route components with the
 * config as props
 */
export function createRoutes(formConfig) {
  // Validate the config while creating the routes because this is really the
  // entry point for applications to use the forms library.
  // TODO: Tree shake this config validation in prod
  validateConfig(formConfig);

  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  let routes = formPages.map(page => ({
    path: page.path,
    component: page.component || FormPage,
    pageConfig: page,
    pageList,
    urlPrefix: formConfig.urlPrefix,
  }));

  if (formConfig.additionalRoutes) {
    routes = formConfig.additionalRoutes
      .map(route => ({
        ...route,
        formConfig,
        pageList,
      }))
      .concat(routes);
  }

  if (formConfig.introduction) {
    routes = [
      {
        path: 'introduction',
        component: formConfig.introduction,
        formConfig,
        pageList,
      },
    ].concat(routes);
  }

  return routes.concat([
    {
      path: 'review-and-submit',
      formConfig,
      component: ReviewPage,
      pageList,
    },
    {
      path: 'confirmation',
      component: formConfig.confirmation,
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ]);
}
