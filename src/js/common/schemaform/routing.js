import _ from 'lodash/fp';
import { getActivePages } from '../utils/helpers';
import { expandArrayPages } from './helpers';

/*
 * Returns the page list without conditional pages that have not satisfied
 * their dependencies and therefore should be skipped.
 */
function getEligiblePages(pageList, data, pathname, pageConfig) {
  const eligiblePageList = getActivePages(pageList, data);
  // Any `showPagePerItem` pages are expanded to create items for each array item.
  // We update the `path` for each of those pages to replace `:index` with the current item index.
  const expandedPageList = expandArrayPages(eligiblePageList, data);
  // We can’t check the pageKey for showPagePerItem pages, because multiple pages will match
  const pageIndex = pageConfig.showPagePerItem
    ? _.findIndex(item => item.path === pathname, expandedPageList)
    : _.findIndex(item => item.pageKey === pageConfig.pageKey, expandedPageList);
  return { pages: expandedPageList, pageIndex };
}

export function getNextPage(pageList, data, pathname, pageConfig) {
  const { pages, pageIndex } = getEligiblePages(pageList, data, pathname, pageConfig);
  return pages[pageIndex + 1].path;
}

export function getPreviousPage(pageList, data, pathname, pageConfig) {
  const { pages, pageIndex } = getEligiblePages(pageList, data, pathname, pageConfig);
  // if we found the current page, go to previous one
  // if not, go back to the beginning because they shouldn’t be here
  const page = pageIndex >= 0 ? pageIndex - 1 : 0;
  return pages[page].path;
}
