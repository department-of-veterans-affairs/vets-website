import findIndex from 'lodash/findIndex';
import { getActiveExpandedPages, stringifyUrlParams } from '../helpers';

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
  return pages?.[pageIndex + 1]?.path;
}

export function getPreviousPagePath(pageList, data, pathname) {
  const { pages, pageIndex } = getEligiblePages(pageList, data, pathname);
  // if we found the current page, go to previous one
  // if not, go back to the beginning because they shouldn’t be here
  const page = pageIndex >= 0 ? pageIndex - 1 : 0;
  return pages?.[page]?.path;
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

export function goBack({
  formData,
  index,
  location,
  onNavBack,
  pageList,
  router,
  setData,
}) {
  const path = getPreviousPagePath(pageList, formData, location.pathname);

  if (typeof onNavBack === 'function') {
    onNavBack({
      formData,
      goPath: customPath => router.push(customPath),
      goPreviousPath: urlParams => {
        const urlParamsString = stringifyUrlParams(urlParams);
        router.push(path + (urlParamsString || ''));
      },
      pageList,
      pathname: location.pathname,
      setFormData: setData,
      urlParams: location.query,
      index,
    });
    return;
  }

  router.push(path);
}

// if a form uses dynamic routes then we check if the last part of the
// pathname ends with the page path (e.g. /21-0779/introduction and /introduction),
// not whether the pathname equals the page path (/introduction and /introduction)
export function getRoute(routes, location, dynamicPaths = false) {
  try {
    return routes.find(r => {
      if (r.path.includes(':index')) {
        const regex = new RegExp(r.path.replace(':index', '\\d+'));
        return regex.test(location.pathname);
      }
      const comparator = `/${r.path}`;
      return dynamicPaths
        ? location.pathname.endsWith(comparator)
        : location.pathname === comparator;
    });
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} pathname e.g. `'/my-form/introduction'`
 * @returns {{ label: string, href: string}[]} for `va-breadcrumbs` `breadcrumbList` prop
 */
export function createBreadcrumbListFromPath(pathname) {
  function breadcrumbItem(label, href) {
    return { label, href };
  }

  const breadcrumbList = [breadcrumbItem('VA.gov home', '/')];

  try {
    // pathname = '/my-form/introduction'
    const pathParts = pathname.split('/').filter(Boolean);
    // pathParts = ['my-form', 'introduction']
    pathParts.pop();
    // pathParts = ['my-form']

    const otherBreadcrumbList = pathParts.map((part, index) => {
      // part = 'my-form'
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      // label = 'My-form'
      label = label.replace(/-/g, ' ');
      // label = 'My form'
      const href = `/${pathParts.slice(0, index + 1).join('/')}`;
      return breadcrumbItem(label, href);
    });
    breadcrumbList.push(...otherBreadcrumbList);
  } catch (error) {
    // suppress error - Just use Home breadcrumb
  }

  return breadcrumbList;
}
