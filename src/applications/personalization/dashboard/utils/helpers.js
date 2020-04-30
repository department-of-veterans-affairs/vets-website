import React from 'react';
import moment from 'moment';

export function formatDate(date, options = {}) {
  const momentDate = moment(date);

  const isValidDate =
    momentDate.isValid() &&
    (!options.validateInPast ||
      momentDate.isSameOrBefore(moment().endOf('day')));

  return isValidDate
    ? momentDate.format(options.format || 'MMMM DD, YYYY')
    : 'Not available';
}

function createQueryString(query) {
  const segments = [];

  for (const key of Object.keys(query)) {
    segments.push(`${key}=${query[key]}`);
  }

  return segments.join('&');
}

export function createUrlWithQuery(url, query) {
  const queryString = createQueryString(query);
  return queryString ? `${url}?${queryString}` : url;
}

export function formattedDate(date, options = {}) {
  if (!date) {
    return 'Not available';
  }

  const now = moment();
  const momentDate = moment(date);
  let dateString;

  if (momentDate.isSame(now, 'd')) {
    dateString = (
      <span>
        {momentDate.format('HH:mm')}
        &nbsp;
        <abbr title="Eastern Standard Time">EST</abbr>
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
          d: '1 day',
        },
      });

      dateString = (
        <span>
          {dateString} ({momentDate.fromNow()})
        </span>
      );
    }
  }

  return dateString;
}
