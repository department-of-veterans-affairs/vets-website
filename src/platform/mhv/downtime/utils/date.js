// Date parsing
// DowntimeNotification uses momentjs, which is deprecated.

const HOUR_MS = 3600000; // 1000 * 60 * 60

/*
 * Attempts to coerce a momentjs object to a plain date. Returns null if it cannot return a date
 * @param {Object} d
 * @returns {(Date|null)}
 */
function coerceToDate(d) {
  if (d instanceof Object && 'toDate' in d) {
    const d1 = d.toDate();
    if (d1 instanceof Date) {
      return d1;
    }
  }
  if (d instanceof Date) {
    return d;
  }
  return null;
}

/**
 * Turns an ISO 8601 datetime string into a Date object
 * @param {string} input - ISO 8601 datetime string
 * @returns {(Date|null)}
 */
function parseDate(input) {
  const dt = Date.parse(input);
  let result = null;

  if (!Number.isNaN(dt)) {
    result = new Date(dt);
  }
  return result;
}

/* Datetime formatter */
const vaDatetimeFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  // timeZone: 'America/New_York',
  timeZoneName: 'short', // `shortGeneric` not supported by node, deno
});

/**
 * Transforms Intl.DateTimeFormat `formatToParts` into a dictionary-like object
 * @typedef {{ type: string, value: string}} DateTimePart
 * @param {DateTimePart[]} dtParts - See Intl.DateTimeFormat.prototype.formatToParts()
 * @returns {Object.<string,string>} - Object of datetime parts
 */
function datetimePartsToObj(dtParts) {
  return dtParts.reduce((acc, currentValue) => {
    if (
      [
        'year',
        'month',
        'day',
        'dayPeriod',
        'hour',
        'minute',
        'timeZoneName',
      ].includes(currentValue.type)
    ) {
      acc[currentValue.type] = currentValue.value;
    }
    return acc;
  }, {});
}

/**
 * Format a Date into a VA-preferred datetime string
 * <https://design.va.gov/content-style-guide/dates-and-numbers>
 * - Shortens timezone name, removing 'S'tandard or 'D'aylight
 * - Formats dayPeriod as 'a.m.' or 'p.m.'
 * - Handles 12:00 as 'noon' or 'midnight'
 * @param {Date} input - Date object instance
 * @returns {string}
 */
function formatDatetime(input) {
  const d = coerceToDate(input);
  if (d === null) return '';
  const dtParts = vaDatetimeFormat.formatToParts(d);
  const dtDict = datetimePartsToObj(dtParts);
  const { year, month, day, hour, minute } = dtDict;
  let { dayPeriod, timeZoneName } = dtDict;

  // remove S or D in timezone abbreviation
  timeZoneName = timeZoneName.replace(/([A-Z])(S|D)T$/, (_, p1) => `${p1}T`);
  // Lowercase and add periods to dayPeriod
  dayPeriod = [...dayPeriod.toLowerCase(), ''].join('.');
  //
  let timeString = `${hour}:${minute} ${dayPeriod}`;
  // Handle 12:00 as noon or midnight
  if (hour === '12' && minute === '00') {
    if (dayPeriod === 'a.m.') {
      timeString = 'midnight';
    } else {
      timeString = 'noon';
    }
  }

  return `${month} ${day}, ${year} at ${timeString} ${timeZoneName}`;
}

/*
 * Calculate a fractional number of hours between two datetimes
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number}
 */
function getElapsedHours(startDate, endDate) {
  const elapsedMs = Math.abs(endDate - startDate);
  return elapsedMs / HOUR_MS;
}

/*
 * Create a string representing estimated elapsed hours. Rounds to nearest hour
 * @param {Date|Moment} start
 * @param {Date|Moment} end
 * @returns {?string} - Elapsed hours as a human-readable string
 */
function formatElapsedHours(start, end) {
  const startDate = coerceToDate(start);
  const endDate = coerceToDate(end);
  if (!(startDate && endDate)) return null;
  let hours = getElapsedHours(startDate, endDate);
  hours = Math.round(hours);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
}

export {
  coerceToDate,
  formatDatetime,
  formatElapsedHours,
  getElapsedHours,
  parseDate,
};
