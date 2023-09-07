import moment from 'moment';

export function dateToMoment(dateField) {
  return moment({
    year: dateField.year.value,
    month: dateField.month.value ? parseInt(dateField.month.value, 10) - 1 : '',
    day: dateField.day ? dateField.day.value : null,
  });
}

export function formatDateLong(date) {
  return moment(date).format('MMMM D, YYYY');
}

export function formatDateParsedZoneLong(date) {
  return moment.parseZone(date).format('MMMM D, YYYY');
}

export function formatDateShort(date) {
  return moment(date).format('MM/DD/YYYY');
}

export function formatDateParsedZoneShort(date) {
  return moment.parseZone(date).format('MM/DD/YYYY');
}

function formatDiff(diff, desc) {
  return `${diff} ${desc}${diff === 1 ? '' : 's'}`;
}

/**
 * timeFromNow returns the number of days, hours, or minutes until
 * the provided date occurs. It’s meant to be less fuzzy than moment’s
 * timeFromNow so it can be used for expiration dates
 *
 * @param date {Moment Date} The future date to check against
 * @param userFromDate {Moment Date} The earlier date in the range. Defaults to today.
 * @returns {string} The string description of how long until date occurs
 */
export function timeFromNow(date, userFromDate = null) {
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

  const secondDiff = date.diff(fromDate, 'seconds');

  if (secondDiff >= 1) {
    return formatDiff(secondDiff, 'second');
  }

  return 'a moment';
}

/**
 * Checks if the passed-in arg is a valid date string, meaning it can be parsed
 * by Date.parse()
 *
 * @param {string} dateString The string to validate
 * @returns {boolean} If the string is a valid date string
 */
export function isValidDateString(dateString) {
  return !isNaN(Date.parse(dateString));
}

const monthIndices = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const LONG_FORM_MONTHS = [
  monthIndices.MAR,
  monthIndices.APR,
  monthIndices.MAY,
  monthIndices.JUN,
  monthIndices.JUL,
];

/**
 * Formats the given date-time into a string that is intended for use in
 * downtime notifications
 *
 * @param {string} dateTime The date-time as a moment or string in Eastern time
 * @returns {string} The formatted date-time string
 */
export const formatDowntime = dateTime => {
  const dtMoment = moment.parseZone(dateTime);
  const dtHour = dtMoment.hour();
  const dtMinute = dtMoment.minute();

  const monthFormat = LONG_FORM_MONTHS.includes(dtMoment.month())
    ? 'MMMM'
    : 'MMM';

  let timeFormat;

  if (dtHour === 0 && dtMinute === 0) {
    timeFormat = '[midnight]';
  } else if (dtHour === 12 && dtMinute === 0) {
    timeFormat = '[noon]';
  } else {
    const amPmFormat = dtHour < 12 ? '[a.m.]' : '[p.m.]';
    timeFormat = `h:mm ${amPmFormat}`;
  }

  return dtMoment.format(`${monthFormat} D [at] ${timeFormat} [ET]`);
};
