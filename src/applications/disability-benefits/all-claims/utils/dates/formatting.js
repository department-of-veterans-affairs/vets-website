import {
  format,
  parse,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  startOfDay,
  add,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  getYear,
  isWithinInterval,
} from 'date-fns';

// Import platform utilities to replace overlapping functionality
import {
  formatDateLong as platformFormatDateLong,
  formatDateShort as platformFormatDateShort,
} from 'platform/utilities/date';
import { isValidYear as platformIsValidYear } from 'platform/forms-system/src/js/utilities/validations';

// Constants
export const DATE_FORMAT = 'MMMM d, yyyy'; // e.g., "January 1, 2021"
export const DATE_FORMAT_SHORT = 'MM/dd/yyyy';
export const DATE_FORMAT_LONG = 'MMMM d, yyyy';
export const PARTIAL_DATE_FORMAT = 'yyyy-MM';
// Public template for full ISO-like date strings used across the all-claims app
export const DATE_TEMPLATE = 'yyyy-MM-dd';
export const DATE_FULL_MONTH_YEAR_FORMAT = 'MMMM yyyy';
export const DATE_SHORT_MONTH_YEAR_FORMAT = 'MMM yyyy'; // e.g., "Jan 2021"
export const DATE_SHORT_MONTH_DAY_YEAR_FORMAT = 'MMM d, yyyy'; // e.g., "Jan 1, 2021"

// Map common Moment.js tokens to date-fns tokens for compatibility in tests/components
const normalizeFormatTokens = fmt => {
  if (!fmt || typeof fmt !== 'string') return DATE_FORMAT;
  return fmt
    .replace(/YYYY/g, 'yyyy')
    .replace(/YY/g, 'yy')
    .replace(/DD/g, 'dd')
    .replace(/D/g, 'd');
};

// Year validation constants
export const MIN_VALID_YEAR = 1900;
export const MAX_VALID_YEAR = 2100;

/**
 * Internal utility to safely parse dates with date-fns
 * @private
 */
const safeFnsDate = (date, dateFormat) => {
  if (!date) return null;
  if (typeof date === 'string' && !/\d/.test(date)) {
    return null;
  }

  // Handle Date objects
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }

  // Reject non-string, non-Date types (booleans, numbers, etc.)
  if (typeof date !== 'string' && !(date instanceof Date)) {
    return null;
  }

  // If a format is provided, use parse with strict parsing
  if (dateFormat) {
    const parsedDate = parse(date, dateFormat, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  // Try parsing as ISO string first
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      // Verify the parsed date is a real calendar date.
      // Allow full ISO timestamps (e.g., 'YYYY-MM-DDTHH:mm:ssZ') by comparing only the date portion.
      const formattedBack = format(parsedDate, 'yyyy-MM-dd');
      const inputDatePortion = date.slice(0, 10);
      if (formattedBack === inputDatePortion) {
        return parsedDate;
      }
    }
    // If it looks like an ISO date but fails validation, don't try fallback
    return null;
  }

  // Fallback to Date constructor
  const parsedDate = new Date(date);
  if (isValid(parsedDate)) {
    // Additional validation for Date constructor results
    // to prevent boolean/number coercion
    return parsedDate;
  }
  return null;
};

/**
 * Format a date string into a display format with custom format
 * For standard formats, use formatDateShort() or formatDateLong()
 * @param {string} date - Date string to format
 * @param {string} formatStr - Optional format string (defaults to DATE_FORMAT)
 * @returns {string} Formatted date or 'Unknown' if invalid
 */
export const formatDate = (date, formatStr = DATE_FORMAT) => {
  const parsedDate = safeFnsDate(date);
  const fmt = normalizeFormatTokens(formatStr);
  return parsedDate ? format(parsedDate, fmt) : 'Unknown';
};

/**
 * Format a date range object
 * @param {Object} dateRange - Object with 'from' and 'to' properties
 * @param {string} formatStr - Optional format string
 * @returns {string} Formatted date range
 */
export const formatDateRange = (dateRange = {}, formatStr = DATE_FORMAT) => {
  if (!dateRange?.from && !dateRange?.to) {
    return 'Unknown';
  }
  const fromDate = formatDate(dateRange.from, formatStr);
  const toDate = formatDate(dateRange.to, formatStr);
  return `${fromDate} to ${toDate}`;
};

/**
 * Format a date as month and year only
 * Handles full dates (YYYY-MM-DD), month/year (YYYY-MM), and year-only (YYYY-XX)
 * @param {string} rawDate - Date string to format
 * @returns {string} Formatted as "Month YYYY", "YYYY", or empty string
 */
export const formatMonthYearDate = (rawDate = '') => {
  if (!rawDate) return '';

  // Handle year-only format (YYYY-XX)
  if (/^\d{4}-XX$/.test(rawDate)) {
    return rawDate.split('-')[0];
  }

  // Handle month/year format (YYYY-MM where MM is 01-12)
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(rawDate)) {
    const [year, month] = rawDate.split('-');
    // Use parse with explicit format to avoid date-fns month offset issues
    // Parse as YYYY-MM-01 to create a valid date, then format as month/year
    const date = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());
    if (isValid(date)) {
      return format(date, 'MMMM yyyy');
    }
    return '';
  }

  // Handle legacy formats that might still exist (YYYY-MM-XX or YYYY-XX-XX)
  // These shouldn't occur with monthYearOnly, but handle for backward compatibility
  if (/^\d{4}-XX-XX$/.test(rawDate)) {
    return rawDate.split('-')[0];
  }

  if (/^\d{4}-\d{2}-XX$/.test(rawDate)) {
    const [year, month] = rawDate.split('-');
    const monthNum = parseInt(month, 10);
    if (monthNum >= 1 && monthNum <= 12) {
      const date = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
        return format(date, 'MMMM yyyy');
      }
    }
    return '';
  }

  // Handle full date format (YYYY-MM-DD) - fallback for any other format
  const date = safeFnsDate(rawDate);
  if (!date) return '';
  return format(date, 'MMMM yyyy');
};

/**
 * Format date in short format (MM/DD/YYYY)
 * Uses platform utility
 * @param {string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateShort = date => {
  try {
    return platformFormatDateShort(date);
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Format date in long format (MMMM D, YYYY)
 * Uses platform utility
 * @param {string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateLong = date => {
  try {
    return platformFormatDateLong(date);
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Check if a date string is valid in YYYY-MM-DD format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidFullDate = dateString => {
  if (!dateString) return false;

  const date = parse(dateString, DATE_TEMPLATE, new Date());
  if (!isValid(date)) return false;

  // Ensure the string matches expected format exactly
  if (dateString !== format(date, DATE_TEMPLATE)) return false;

  // Check year is within reasonable range
  const year = getYear(date);
  return year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR;
};

/**
 * Validate a year value
 * Uses platform utility but adds custom error message
 * @param {any} err - Error object (for form validation)
 * @param {string|number} fieldData - Year value to validate
 */
export const isValidYear = (err, fieldData) => {
  if (!platformIsValidYear(fieldData)) {
    err.addError('Please enter a valid year');
  }
};

/**
 * Validate age based on date
 * @param {any} err - Error object
 * @param {string} fieldData - Date string
 * @param {Object} formData - Form data containing veteranDateOfBirth
 */
export const validateAge = (err, fieldData, formData) => {
  const dateOfBirth = formData?.veteranDateOfBirth;
  if (!dateOfBirth || !fieldData) return;

  const dateOfBirthDate = safeFnsDate(dateOfBirth);
  const fieldDate = safeFnsDate(fieldData);

  if (!dateOfBirthDate || !fieldDate) return;

  const thirteenthBirthday = add(dateOfBirthDate, { years: 13 });

  if (isBefore(fieldDate, thirteenthBirthday)) {
    err.addError('Date must be after 13th birthday');
  }
};

/**
 * Validate separation date
 * @param {any} err - Error object
 * @param {string} fieldData - Separation date
 * @param {Object} formData - Form data
 */
export const validateSeparationDate = (err, fieldData, formData) => {
  if (!fieldData) return;

  const separationDate = safeFnsDate(fieldData);
  if (!separationDate) return;

  // Check service periods
  const servicePeriods = formData?.serviceInformation?.servicePeriods || [];

  servicePeriods.forEach(period => {
    const startDate = safeFnsDate(period.dateRange?.from);

    if (startDate && separationDate < startDate) {
      err.addError('Separation date must be after service start date');
    }
  });
};

/**
 * Validate service period
 * @param {Object} errors - Errors object
 * @param {Object} fieldData - Service period data
 */
export const validateServicePeriod = (errors, fieldData) => {
  const { from, to } = fieldData || {};

  if (!from || !to) {
    errors.addError('Please provide both start and end dates');
    return;
  }

  const startDate = safeFnsDate(from);
  const endDate = safeFnsDate(to);

  if (!startDate || !endDate) {
    errors.addError('Please provide valid dates');
    return;
  }

  if (isBefore(endDate, startDate)) {
    errors.addError('End date must be after start date');
  }
};

/**
 * Validate date is less than 180 days in the future
 * @param {any} errors - Errors object
 * @param {string} fieldData - Date to check
 */
export const isLessThan180DaysInFuture = (errors, fieldData) => {
  const enteredDate = safeFnsDate(fieldData);

  if (!enteredDate) {
    errors.addError('Please provide a valid date');
    return;
  }

  const today = startOfDay(new Date());
  const in180Days = startOfDay(add(new Date(), { days: 180 }));

  if (
    isBefore(enteredDate, today) ||
    enteredDate.getTime() === today.getTime()
  ) {
    errors.addError('Enter a future separation date');
  } else if (
    isAfter(enteredDate, in180Days) ||
    enteredDate.getTime() === in180Days.getTime()
  ) {
    errors.addError('Enter a separation date less than 180 days in the future');
  }
};

/**
 * Check if date(s) are within a range
 * @param {string|Array} dates - Date or array of dates
 * @param {Object} range - Range object with from/to properties
 * @returns {boolean} True if within range
 */
export const isWithinRange = (dates, range) => {
  if (!dates || !range?.from || !range?.to) return false;

  const startDate = safeFnsDate(range.from);
  const endDate = safeFnsDate(range.to);

  if (!startDate || !endDate) return false;

  const datesToCheck = Array.isArray(dates) ? dates : [dates];

  return datesToCheck.every(date => {
    const dateToValidate = safeFnsDate(date);
    return (
      dateToValidate &&
      isWithinInterval(startOfDay(dateToValidate), {
        start: startOfDay(startDate),
        end: startOfDay(endDate),
      })
    );
  });
};

/**
 * Check if date is within service period
 * @param {string} date - Date to check
 * @param {Array} servicePeriods - Array of service periods
 * @returns {boolean} True if within any service period
 */
export const isWithinServicePeriod = (date, servicePeriods = []) => {
  if (!date || !servicePeriods || !servicePeriods.length) return false;

  return servicePeriods.some(period => isWithinRange(date, period.dateRange));
};

/**
 * Parse a date string
 * @param {string} dateString - Date to parse
 * @param {string} dateFormat - Optional format
 * @returns {Date|null} Parsed date object or null
 */
export const parseDate = (dateString, dateFormat) => {
  return safeFnsDate(dateString, dateFormat);
};

/**
 * Parse date with specific template
 * @param {string} dateString - Date to parse
 * @returns {Date|null} Parsed date object
 */
export const parseDateWithTemplate = dateString => {
  return safeFnsDate(dateString, DATE_TEMPLATE);
};

/**
 * Check if BDD claim is valid (90-180 days from separation)
 * @param {string} separationDate - Separation date
 * @returns {boolean} True if valid for BDD
 */
export const isBddClaimValid = separationDate => {
  const separationDateParsed = safeFnsDate(separationDate);
  if (!separationDateParsed) return false;

  const today = startOfDay(new Date());
  const daysUntilSeparation = differenceInDays(separationDateParsed, today);

  return daysUntilSeparation >= 90 && daysUntilSeparation <= 180;
};

/**
 * Get BDD separation date error message
 * @param {string} separationDate - Separation date
 * @returns {string|null} Error message or null if valid
 */
export const getBddSeparationDateError = separationDate => {
  const separationDateParsed = safeFnsDate(separationDate);
  if (!separationDateParsed) return 'Please provide a valid separation date';

  const today = startOfDay(new Date());
  const daysUntilSeparation = differenceInDays(separationDateParsed, today);

  if (daysUntilSeparation < 90) {
    return 'Your separation date must be at least 90 days in the future to file a BDD claim';
  }

  if (daysUntilSeparation > 180) {
    return 'Your separation date must be no more than 180 days in the future to file a BDD claim';
  }

  return null;
};

/**
 * Check if a date string represents a month-only date (XXXX-MM-XX)
 * @param {string} fieldData - Date string to check
 * @returns {boolean} True if month-only format
 */
export const isMonthOnly = fieldData => {
  return /^XXXX-\d{2}-XX$/.test(fieldData);
};

/**
 * Check if a date string represents a year-only date (YYYY-XX-XX)
 * @param {string} fieldData - Date string to check
 * @returns {boolean} True if year-only format
 */
export const isYearOnly = fieldData => {
  return /^\d{4}-XX-XX$/.test(fieldData);
};

/**
 * Check if a date string represents a year-month date (YYYY-MM-XX)
 * @param {string} fieldData - Date string to check
 * @returns {boolean} True if year-month format
 */
export const isYearMonth = fieldData => {
  return /^\d{4}-\d{2}-XX$/.test(fieldData);
};

/**
 * Find the earliest service date from an array of service periods
 * @param {Array} servicePeriods - Array of service period objects
 * @returns {Date|null} Earliest service date or null if no valid dates
 */
export const findEarliestServiceDate = servicePeriods => {
  if (!servicePeriods || !Array.isArray(servicePeriods)) {
    return null;
  }

  // Filter out periods without valid serviceBranch and dateRange.from
  const validPeriods = servicePeriods
    .filter(
      ({ serviceBranch, dateRange } = {}) =>
        (serviceBranch || '') !== '' && dateRange?.from,
    )
    .map(period => safeFnsDate(period.dateRange.from, 'yyyy-MM-dd'))
    .filter(dateObj => dateObj !== null);

  if (validPeriods.length === 0) {
    return null;
  }

  // Use the first valid date as initial value and find the earliest
  const earliest = validPeriods.reduce(
    (earliestDate, current) =>
      isBefore(current, earliestDate) ? current : earliestDate,
    validPeriods[0],
  );
  // Attach a minimal format method for tests expecting moment-like API
  try {
    Object.defineProperty(earliest, 'format', {
      value: fmt => format(earliest, normalizeFormatTokens(fmt)),
      configurable: true,
      enumerable: false,
      writable: true,
    });
  } catch (e) {
    // no-op if defineProperty fails
  }
  return earliest;
};

/**
 * Check if treatment date is before service based on date format
 * @param {Date} treatmentDate - Treatment date
 * @param {Date} earliestServiceDate - Earliest service date
 * @param {string} fieldData - Original date string to check format
 * @returns {boolean} True if treatment is before service
 */
export const isTreatmentBeforeService = (
  treatmentDate,
  earliestServiceDate,
  fieldData,
) => {
  return (
    (isYearOnly(fieldData) &&
      differenceInYears(earliestServiceDate, treatmentDate) > 0) ||
    (isYearMonth(fieldData) &&
      differenceInMonths(earliestServiceDate, treatmentDate) > 0)
  );
};

/*
 * Helper Methods for Date Validation and Formatting in regards to inputs
 */
export const daysFromToday = days =>
  formatDate(add(new Date(), { days }), 'yyyy-MM-dd');

export const getToday = () => {
  const today = parseDate(daysFromToday(0));
  if (!today) return null;
  // Attach a minimal add shim to support legacy code expecting moment-like API
  try {
    Object.defineProperty(today, 'add', {
      value: duration => add(today, duration),
      configurable: true,
      enumerable: false,
      writable: true,
    });
  } catch (e) {
    // no-op
  }
  return today;
};
