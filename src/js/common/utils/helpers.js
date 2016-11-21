import _ from 'lodash';

export function getPageList(routes) {
  return routes.map(route => {
    const obj = {
      name: route.props.path,
      label: route.props.name
    };
    if (route.props.depends) {
      obj.depends = route.props.depends;
    }
    return obj;
  }).filter(page => page.name !== '/submit-message');
}

export function groupPagesIntoChapters(routes) {
  const pageList = routes
    .filter(route => route.props.chapter)
    .map(page => {
      const obj = {
        name: page.props.name,
        chapter: page.props.chapter,
        path: page.props.path
      };

      if (page.props.depends) {
        obj.depends = page.props.depends;
      }

      return obj;
    });

  const pageGroups = _.groupBy(pageList, page => page.chapter);

  return Object.keys(pageGroups).map(chapter => {
    return {
      name: chapter,
      pages: pageGroups[chapter]
    };
  });
}
export function isActivePage(page, data) {
  if (typeof page.depends === 'function') {
    return page.depends(data);
  }

  if (Array.isArray(page.depends)) {
    return page.depends.some(condition => _.matches(condition)(data));
  }

  return page.depends === undefined || _.matches(page.depends)(data);
}

export function getActivePages(pages, data) {
  return pages.filter(page => isActivePage(page, data));
}
