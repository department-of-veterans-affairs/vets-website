import _ from 'lodash';
import moment from 'moment';
import Scroll from 'react-scroll';
import fastLevenshtein from 'fast-levenshtein';

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

export function isInProgress(pathName) {
  const trimmedPathname = pathName.replace(/\/$/, '');
  return !(
    trimmedPathname.endsWith('introduction')
    || trimmedPathname.endsWith('confirmation')
    || trimmedPathname.endsWith('form-saved')
    || trimmedPathname.endsWith('error')
  );
}

export function isActivePage(page, data) {
  if (typeof page.depends === 'function') {
    return page.depends(data, page.index);
  }

  if (Array.isArray(page.depends)) {
    return page.depends.some(condition => _.matches(condition)(data));
  }

  return page.depends === undefined || _.matches(page.depends)(data);
}

export function getActivePages(pages, data) {
  return pages.filter(page => isActivePage(page, data));
}

export function getInactivePages(pages, data) {
  return pages.filter(page => !isActivePage(page, data));
}

export function getCurrentFormStep(chapters, path) {
  let step;
  chapters.forEach((chapter, index) => {
    if (chapter.pages.some(page => page.path === path)) {
      step = index + 1;
    }
  });

  return step;
}

export function getCurrentPageName(chapters, path) {
  let name;
  chapters.forEach((chapter) => {
    if (chapter.pages.some(page => page.path === path)) {
      name = chapter.name;
    }
  });

  return name;
}

export function dateToMoment(dateField) {
  return moment({
    year: dateField.year.value,
    month: dateField.month.value ? parseInt(dateField.month.value, 10) - 1 : '',
    day: dateField.day ? dateField.day.value : null
  });
}

export function formatDateLong(date) {
  return moment(date).format('MMMM DD, YYYY');
}

export function formatDateParsedZoneLong(date) {
  return moment.parseZone(date).format('MMMM DD, YYYY');
}

export function formatDateShort(date) {
  return moment(date).format('MM/DD/YYYY');
}

export function formatDateParsedZoneShort(date) {
  return moment.parseZone(date).format('MM/DD/YYYY');
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
    // document.body.scrollTop doesn’t work with all browsers, so we’ll cover them all like so:
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const position = errorEl.getBoundingClientRect().top + currentPosition;
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}

export function scrollAndFocus(errorEl) {
  if (errorEl) {
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const position = errorEl.getBoundingClientRect().top + currentPosition;
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}

export function displayFileSize(size) {
  if (size < 1024) {
    return `${size}B`;
  }

  const kbSize = size / 1024;
  if (kbSize < 1024) {
    return `${Math.round(kbSize)}KB`;
  }

  const mbSize = kbSize / 1024;
  return `${Math.round(mbSize)}MB`;
}

function formatDiff(diff, desc) {
  return `${diff} ${desc}${diff === 1 ? '' : 's'}`;
}

/**
 * dateDiffDesc returns the number of days, hours, or minutes until
 * the provided date occurs. It’s meant to be less fuzzy than moment’s
 * dateDiffDesc so it can be used for expiration dates
 *
 * @param date {Moment Date} The future date to check against
 * @param userFromDate {Moment Date} The earlier date in the range. Defaults to today.
 * @returns {string} The string description of how long until date occurs
 */
export function dateDiffDesc(date, userFromDate = null) {
  // Not using defaulting because we want today to be when this function
  // is called, not when the file is parsed and run
  const fromDate = userFromDate || moment();
  const dayDiff = date.diff(fromDate, 'days');

  if (dayDiff >= 1) {
    return formatDiff(dayDiff, 'day');
  }

  const hourDiff = date.diff(fromDate, 'hours');

  if (hourDiff >= 1) {
    return formatDiff(hourDiff, 'hour');
  }

  const minuteDiff = date.diff(fromDate, 'minutes');

  if (minuteDiff >= 1) {
    return formatDiff(minuteDiff, 'minute');
  }

  return 'less than a minute';
}

function isGaLoaded() {
  return !!(window.ga && ga.create);
}

// google analytics client Id
/* global gaClientId ga:true */
export function gaClientId() {
  let clientId;
  if (isGaLoaded()) {
    for (const data of ga.getAll()) {
      if (data.get('cookieDomain') === 'vets.gov') {
        clientId = data.get('clientId');
      }
    }
  }
  return clientId;
}

export function sortListByFuzzyMatch(value, list, prop = 'label') {
  return list
    .map(option => {
      const label = option[prop].toUpperCase().replace(/[^a-zA-Z ]/g, '');
      const val = value.toUpperCase().replace(/[^a-zA-Z ]/g, '');
      let score = label.includes(val) ? 0 : Infinity;

      // if the search term is just one word, split the
      // list into words and find the best match
      if (score > 0 && !val.includes(' ')) {
        score = Math.min.apply(null,
          label
            .split(/[ ,]/)
            .map(word => fastLevenshtein.get(word, val))
            .filter(wordScore => wordScore < val.length)
        );
      } else if (score > 0) {
        score = fastLevenshtein.get(label, val);
      }

      return {
        score,
        original: option
      };
    })
    .sort((a, b) => {
      const result = a.score - b.score;

      if (result === 0) {
        return a.original[prop].length - b.original[prop].length;
      }

      return result;
    })
    .map(sorted => sorted.original);
}

export function sanitizeForm(formData) {
  try {
    const suffixes = ['vaFileNumber', 'first', 'last', 'accountNumber', 'socialSecurityNumber', 'dateOfBirth'];
    return JSON.stringify(formData, (key, value) => {
      if (value && suffixes.some(suffix => key.toLowerCase().endsWith(suffix.toLowerCase()))) {
        return 'removed';
      }

      return value;
    });
  } catch (e) {
    return null;
  }
}
