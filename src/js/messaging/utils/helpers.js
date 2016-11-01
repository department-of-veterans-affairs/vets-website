import _ from 'lodash';
import moment from 'moment';

export function createQueryString(query, snakeCase = true) {
  const segments = [];

  for (const key of Object.keys(query)) {
    // Linter only accepts camelCase keys, but API only
    // recognizes snake_case for query string parameters.
    if (snakeCase) {
      const formattedKey = _.snakeCase(key);
      segments.push(`${formattedKey}=${query[key]}`);
    } else {
      segments.push(`${key}=${query[key]}`);
    }
  }

  return segments.join('&');
}

export function createUrlWithQuery(url, query) {
  const queryString = createQueryString(query);
  const fullUrl = queryString
                ? `${url}?${queryString}`
                : url;

  return fullUrl;
}

export function formatFileSize(bytes, decimalplaces = 2) {
  const kilo = 1000;
  const mega = 1000000;
  const multiplier = Math.pow(10, decimalplaces);
  let size;

  if (bytes < kilo) {
    size = `${bytes}B`;
  }

  if (bytes > kilo && bytes < mega) {
    const kbytes = Math.ceil(bytes / kilo);
    size = `${kbytes}K`;
  }

  if (bytes > mega) {
    const mbytes = Math.round((bytes / mega) * multiplier) / multiplier;
    size = `${mbytes}M`;
  }

  return size;
}

export function formattedDate(date, options = {}) {
  if (!date) { return 'Not available'; }

  const now = moment();
  const momentDate = moment(date);
  let dateString;

  if (momentDate.isSame(now, 'd')) {
    dateString = momentDate.format('HH:mm');
  } else if (momentDate.isSame(now, 'y')) {
    dateString = momentDate.format('MMM D');
  } else {
    return momentDate.format('MM/DD/YYYY');
  }

  if (options.fromNow) {
    const weeksAgo = now.diff(momentDate, 'w');

    if (weeksAgo < 2) {
      // Overwrite defaults for singular units ('a(n)' -> '1') when
      // displaying the 'ago' string. Use the defaults for plural.
      moment.locale('en', {
        relativeTime: {
          m: '1 minute',
          h: '1 hour',
          d: '1 day'
        }
      });

      dateString = `${dateString} (${momentDate.fromNow()})`;
    }
  }

  return dateString;
}

export function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}
