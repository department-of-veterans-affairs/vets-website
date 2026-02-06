import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { formatDateShort } from '../../utilities/date';

/**
 * Parses and validates a birth date string in YYYY-MM-DD format.
 *
 * @param {string} dateStr - The date string to parse in YYYY-MM-DD format
 * @returns {{year: string, month: string, day: string} | null} The parsed date components, or null if format doesn't match
 * @throws {Error} If month or day values are out of range
 */
const parseBirthDate = dateStr => {
  // Regex check for YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }

  const [year, month, day] = dateStr.split('-');

  // Validate month range
  if (month < '01' || month > '12') {
    throw new Error('Invalid month in date string');
  }

  // Validate day range (01–31 only, no per-month/day-of-month checks)
  if (day < '01' || day > '31') {
    throw new Error('Invalid day in date string');
  }

  return { year, month, day };
};

const MONTH_NAMES = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

/**
 * Formats a birth date string to long format (e.g., "January 1, 2025"). We always expect to get
 * this date in YYYY-MM-DD format. If the string is in a different format, fall back to the
 * formatDateLong function by default.
 *
 * The purpose of this function is to provide a consistent and reliable way to format birth dates
 * using string-only parsing, eliminating the potential for time zone-related issues.
 *
 * @param {string} dateStr - The date string to format in YYYY-MM-DD format
 * @param {function} fallback - The fallback function to call if the format is invalid
 * @returns {string} The formatted date string
 */
export const formatBirthDateLong = (dateStr, fallback = formatDateLong) => {
  const parsed = parseBirthDate(dateStr);
  if (!parsed) {
    return fallback(dateStr);
  }

  const { year, month, day } = parsed;
  // Strip leading zero from day (e.g. "01" -> "1")
  const dayNum = day.startsWith('0') ? day.slice(1) : day;

  return `${MONTH_NAMES[month]} ${dayNum}, ${year}`;
};

/**
 * Formats a birth date string to short numeric format (e.g., "1/1/2025"). We always expect to get
 * this date in YYYY-MM-DD format. If the string is in a different format, fall back to the
 * formatDateShort function by default.
 *
 * The purpose of this function is to provide a consistent and reliable way to format birth dates
 * using string-only parsing, eliminating the potential for time zone-related issues.
 *
 * @param {string} dateStr - The date string to format in YYYY-MM-DD format
 * @param {function} fallback - The fallback function to call if the format is invalid
 * @returns {string} The formatted date string in M/D/YYYY format
 */
export const formatBirthDateShort = (dateStr, fallback = formatDateShort) => {
  const parsed = parseBirthDate(dateStr);
  if (!parsed) {
    return fallback(dateStr);
  }

  const { year, month, day } = parsed;
  // Strip leading zeros (e.g. "01" -> "1")
  const monthNum = month.startsWith('0') ? month.slice(1) : month;
  const dayNum = day.startsWith('0') ? day.slice(1) : day;

  return `${monthNum}/${dayNum}/${year}`;
};
