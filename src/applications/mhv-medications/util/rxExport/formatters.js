import { parseISO, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// ============================================================================
// Constants
// ============================================================================

export const FIELD_NONE_NOTED = 'None noted';
export const FIELD_NOT_AVAILABLE = 'Not available';
export const NO_PROVIDER_NAME = 'Provider name not available';

export const DATETIME_FORMATS = {
  longMonthDate: 'MMMM d, yyyy',
  filename: 'M-d-yyyy_hmmssaaa',
};

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Normalizes a datetime string into ISO format.
 * Supports RFC 2822-style dates (e.g. `"Mon, 24 Feb 2025 03:39:11 EST"`)
 *
 * @param {string} dateString The input datetime string.
 * @returns {string|null} ISO string if converted from RFC 2822, otherwise `null` to let parseISO handle it.
 */
const convertToISO = dateString => {
  if (!dateString) {
    return null;
  }
  // Only convert RFC 2822-style dates; let parseISO handle all other formats
  const rfc2822Regex = /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} [A-Z]{3}$/;
  if (!rfc2822Regex.test(dateString)) {
    return null;
  }
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
 * @param {string} [formatString] a date-fns format string
 * @param {string} [noDateMessage] message when there is no date being passed
 * @param {string} [dateWithMessage] message to prepend when there is a date
 * @param {string} [timeZone] the IANA timezone to convert to
 * @returns {string} formatted timestamp, or fallback message
 */
export const formatDate = (
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
    return 'Invalid date';
  }
};

// ============================================================================
// Field Validation
// ============================================================================

/**
 * Returns field value or default message if empty
 * @param {*} fieldValue value to validate
 * @returns {*} fieldValue or "None noted"
 */
export const validateField = fieldValue => {
  if (fieldValue || fieldValue === 0) {
    return fieldValue;
  }
  return FIELD_NONE_NOTED;
};

/**
 * Returns field value or a contextual "not available" message
 * @param {string} fieldName field name for the error message
 * @param {*} fieldValue value to validate
 * @returns {*} fieldValue or "{fieldName} not available"
 */
export const validateFieldWithName = (fieldName, fieldValue) => {
  if (fieldValue || fieldValue === 0) {
    return fieldValue;
  }
  return `${fieldName} not available`;
};

// ============================================================================
// Provider Name Formatting
// ============================================================================

/**
 * Display the provider's name based on availability
 * @param {string} first - The first name of the provider.
 * @param {string} last - The last name of the provider.
 * @returns {string}
 */
export const formatProviderName = (first, last) => {
  if (first && last) {
    return `${first} ${last}`;
  }
  if (first || last) {
    return first || last;
  }
  return NO_PROVIDER_NAME;
};

// ============================================================================
// User Info Formatting
// ============================================================================

/**
 * Format user's full name in "Last, First" format
 * @param {Object} userName - Object with first and last properties
 * @returns {string}
 */
export const formatUserFullName = userName => {
  if (!userName) return ' ';
  return userName.first
    ? `${userName.last}, ${userName.first}`
    : userName.last || ' ';
};

/**
 * Format user name for filenames (no commas, uses hyphen)
 * @param {Object} userName - Object with first and last properties
 * @returns {string}
 */
export const formatUserNameForFilename = userName => {
  if (!userName) return 'unknown';
  return userName.first
    ? `${userName.first}-${userName.last}`
    : userName.last || 'unknown';
};

/**
 * Format date of birth for display
 * @param {string|Date} dob - Date of birth
 * @returns {string}
 */
export const formatDob = dob => {
  return `Date of birth: ${formatDate(dob, DATETIME_FORMATS.longMonthDate)}`;
};

// ============================================================================
// List Processing
// ============================================================================

/**
 * Join array items into a string, or return fallback message
 * @param {Array} list - array of strings
 * @param {string} emptyMessage - message when list is empty
 * @returns {string}
 */
export const formatList = (list, emptyMessage) => {
  if (Array.isArray(list)) {
    if (list?.length > 1) return list.join('. ');
    if (list?.length === 1) return list.toString();
  }
  return emptyMessage || FIELD_NONE_NOTED;
};

// ============================================================================
// Timestamp Generation
// ============================================================================

/**
 * Generates a timestamp for filenames in America/New_York timezone
 * @returns {string} formatted timestamp (e.g., "1-1-2025_30456am")
 */
export const generateTimestamp = () =>
  formatDate(
    Date.now(),
    DATETIME_FORMATS.filename,
    null,
    null,
    'America/New_York',
  ).replace(/\./g, '');
