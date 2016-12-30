import React from 'react';
import _ from 'lodash';
import merge from 'lodash/fp/merge';
import moment from 'moment';

import environment from '../../common/helpers/environment';

function createQueryString(query) {
  const segments = [];

  for (const key of Object.keys(query)) {
    segments.push(`${key}=${query[key]}`);
  }

  return segments.join('&');
}

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function createUrlWithQuery(url, query) {
  const queryString = createQueryString(query);
  const fullUrl = queryString
                ? `${url}?${queryString}`
                : url;

  return fullUrl;
}

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}/v0/messaging/health`;
  const url = resource[0] === '/'
            ? [baseUrl, resource].join('')
            : resource;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel'
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(url, settings)
    .then((response) => {
      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) { return window.location.reload(); }
        return Promise.reject(response);
      } else if (isJson(response)) {
        return response.json();
      }

      return Promise.resolve(response);
    })
    .then(success, error);
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
    dateString = (
      <span>
        {momentDate.format('HH:mm')}
        &nbsp;<abbr title="Eastern Standard Time">EST</abbr>
      </span>
    );
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

      dateString = <span>{dateString} ({momentDate.fromNow()})</span>;
    }
  }

  return dateString;
}

export function folderUrl(folderName) {
  return folderName ? `/${_.kebabCase(folderName)}` : '/inbox';
}
