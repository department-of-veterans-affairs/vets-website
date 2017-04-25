import _ from 'lodash';
import moment from 'moment';
import Scroll from 'react-scroll';

export function getPageList(routes, prefix = '') {
  return routes.map(route => {
    const obj = {
      name: `${prefix}${route.path}`,
      label: route.name
    };
    if (route.depends) {
      obj.depends = route.depends;
    }
    return obj;
  }).filter(page => page.name !== '/submit-message');
}

export function groupPagesIntoChapters(routes, prefix = '') {
  const pageList = routes
    .filter(route => route.chapter)
    .map(page => {
      const obj = {
        name: page.name,
        chapter: page.chapter,
        path: `${prefix}${page.path}`,
      };

      if (page.depends) {
        obj.depends = page.depends;
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

export function dateToMoment(dateField) {
  return moment({
    year: dateField.year.value,
    month: dateField.month.value ? parseInt(dateField.month.value, 10) - 1 : '',
    day: dateField.day ? dateField.day.value : null
  });
}

export function focusElement(selectorOrElement) {
  const el = typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement;

  if (el) {
    el.setAttribute('tabindex', '-1');
    el.focus();
  }
}

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.VetsGov || {};
  const defaults = {
    duration: 500,
    delay: 0,
    smooth: true
  };
  return _.merge({}, defaults, globals.scroll, additionalOptions);
}

export function scrollToFirstError() {
  const errorEl = document.querySelector('.usa-input-error, .input-error-date');
  if (errorEl) {
    // document.body.scrollTop doesn't work with all browsers, so we'll cover them all like so:
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const position = errorEl.getBoundingClientRect().top + currentPosition;
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}

export function scrollAndFocus(errorEl) {
  const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const position = errorEl.getBoundingClientRect().top + currentPosition;
  Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
  focusElement(errorEl);
}
