import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import {
  getActiveExpandedPages,
  createFormPageList,
  createPageList,
} from './helpers';

import FormPage from './containers/FormPage';
import ReviewPage from './review/ReviewPage';
/*
 * Returns the page list without conditional pages that have not satisfied
 * their dependencies and therefore should be skipped.
 */
export function getEligiblePages(pageList, data, pathname) {
  const eligiblePageList = getActiveExpandedPages(pageList, data);
  const pageIndex = _.findIndex(
    item => item.path === pathname,
    eligiblePageList,
  );
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

/*
 * Create the routes based on a form config. This goes through each chapter in a form
 * config, pulls out the config for each page, then generates a list of Route components with the
 * config as props
 */
export function createRoutes(formConfig) {
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
      onEnter: (nextState, replace) => replace(formConfig.urlPrefix || '/'),
    },
  ]);
}
