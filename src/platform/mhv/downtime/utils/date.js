// Date parsing
// DowntimeNotification uses momentjs, which is deprecated.
import { formatDuration, differenceInHours } from 'date-fns';
import { format } from 'date-fns-tz';

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

  let timeString = format(d, "MMMM d, yyyy 'at' h:mm bbbb z");

  // remove S or D in timezone abbreviation
  timeString = timeString.replace(/([A-Z])(S|D)T$/, (_, p1) => `${p1}T`);

  // Handle 12:00 as noon or midnight
  timeString = timeString.replace(
    /\d{1,2}:\d{2} (noon|midnight)/,
    (_, p1) => `${p1}`,
  );

  return timeString;
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
  const hours = differenceInHours(endDate, startDate, {
    roundingMethod: 'round',
  });
  return formatDuration({ hours });
}

export { coerceToDate, formatDatetime, formatElapsedHours, parseDate };
