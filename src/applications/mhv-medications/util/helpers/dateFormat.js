import { parseISO, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { DATETIME_FORMATS, FIELD_NONE_NOTED } from '../constants';

/**
 * Normalizes a datetime string into ISO format.
 *
 * Primarily supports RFC 2822-style dates (e.g. `"Mon, 24 Feb 2025 03:39:11 EST"`)
 * returned in `prescription.trackingList`, but will also handle any value
 * that the native `Date` constructor can parse.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc2822#section-3.3}
 *
 * @param {string} dateString The input datetime string.
 * @returns {string|null} ISO string if parsed successfully, otherwise `null`.
 */
const convertToISO = dateString => {
  // Regular expression to match the expected date format
  const regex = /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} [A-Z]{3}$/;
  // Return null if the format is invalid
  if (!regex.test(dateString)) {
    return null;
  }
  // Return null if the date is invalid
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

/**
 * Formats a datetime value into a human-readable string.
 *
 * @param {string|Date} timestamp The datetime value to format.
 *   Accepts:
 *   - a JavaScript `Date` object,
 *   - an RFC 2822 string (e.g. `"Mon, 24 Feb 2025 03:39:11 EST"`),
 *   - or any other value that the native `Date` constructor can parse
 *
 *   If `timestamp` is falsy, the function returns the `noDateMessage` (if provided) or `FIELD_NONE_NOTED` if not.
 *
 * @param {string} [formatString] a date-fns format string (docs: https://date-fns.org/v4.1.0/docs/format). Defaults to `DATETIME_FORMATS.longMonthDate` if not provided
 * @param {string} [noDateMessage] message when there is no date being passed. Defaults to `FIELD_NONE_NOTED` if not provided.
 * @param {string} [dateWithMessage] message when there is a date being passed, node date will be appended to the end of this message
 * @param {string} [timeZone] the IANA timezone to convert to (e.g. "America/New_York")
 * @returns {string} formatted timestamp, or "Invalid date" if the input cannot be parsed.
 */
export const dateFormat = (
  timestamp,
  formatString = DATETIME_FORMATS.longMonthDate,
  noDateMessage = FIELD_NONE_NOTED,
  dateWithMessage,
  timeZone,
) => {
  if (!timestamp) {
    return noDateMessage || FIELD_NONE_NOTED;
  }

  let date = timestamp;
  if (typeof timestamp === 'string') {
    const isoTimestamp = convertToISO(timestamp);
    date = parseISO(isoTimestamp ?? timestamp);
  }

  try {
    const finalTimestamp = timeZone
      ? formatInTimeZone(
          date,
          timeZone,
          formatString || DATETIME_FORMATS.longMonthDate,
        )
      : format(date, formatString || DATETIME_FORMATS.longMonthDate);

    if (dateWithMessage && finalTimestamp) {
      return `${dateWithMessage}${finalTimestamp}`;
    }

    return finalTimestamp;
  } catch (e) {
    // Behave similarly to moment and return the string 'Invalid date' if we can't parse the date
    return 'Invalid date';
  }
};
