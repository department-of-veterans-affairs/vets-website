import _ from 'lodash';

export function isActivePage(page, data) {
  if (typeof page.depends === 'function') {
    return page.depends(data);
  }

  return page.depends === undefined || _.matches(page.depends)(data);
}

export function getActivePages(pages, data) {
  return pages.filter(page => isActivePage(page, data));
}
