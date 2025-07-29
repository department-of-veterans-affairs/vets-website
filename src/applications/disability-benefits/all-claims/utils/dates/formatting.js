/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/start-of */
/* eslint-disable you-dont-need-momentjs/add */
import moment from 'moment';

// Constants
export const DATE_FORMAT = 'LL'; // e.g., "January 1, 2021"
export const DATE_FORMAT_SHORT = 'MM/DD/YYYY';
export const DATE_FORMAT_LONG = 'MMMM D, YYYY';
export const PARTIAL_DATE_FORMAT = 'YYYY-MM';
const DATE_TEMPLATE = 'YYYY-MM-DD';

// Year validation constants
export const MIN_VALID_YEAR = 1900;
export const MAX_VALID_YEAR = 2100;

/**
 * Helper function to validate if a year string is within the valid range
 * @param {string|number} yearString - Year to validate
 * @returns {boolean} True if year is valid
 */
const isValidYearInRange = yearString => {
  if (!yearString) return false;
  const year = parseInt(yearString, 10);
  return (
    !Number.isNaN(year) && year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR
  );
};

/**
 * Internal utility to safely parse dates with moment
 * @private
 */
const safeMoment = (date, format) => {
  if (!date) return null;
  if (typeof date === 'string' && !/\d/.test(date)) {
    return null;
  }

  const momentDate = format ? moment(date, format, true) : moment(date);
  return momentDate.isValid() ? momentDate : null;
};

/**
 * Format a date string into a display format
 * @param {string} date - Date string to format
 * @param {string} format - Optional format string (defaults to DATE_FORMAT)
 * @returns {string} Formatted date or 'Unknown' if invalid
 */
export const formatDate = (date, format = DATE_FORMAT) => {
  const momentDate = safeMoment(date);
  return momentDate ? momentDate.format(format) : 'Unknown';
};

/**
 * Format a date range object
 * @param {Object} dateRange - Object with 'from' and 'to' properties
 * @param {string} format - Optional format string
 * @returns {string} Formatted date range
 */
export const formatDateRange = (dateRange = {}, format = DATE_FORMAT) => {
  if (!dateRange?.from && !dateRange?.to) {
    return 'Unknown';
  }
  const fromDate = formatDate(dateRange.from, format);
  const toDate = formatDate(dateRange.to, format);
  return `${fromDate} to ${toDate}`;
};

/**
 * Format a date as month and year only
 * @param {string} rawDate - Date string to format
 * @returns {string} Formatted as "Month YYYY" or empty string
 */
export const formatMonthYearDate = (rawDate = '') => {
  if (!rawDate) return '';

  const date = safeMoment(rawDate);
  if (!date) return '';

  return date.format('MMMM YYYY');
};

/**
 * Format date in short format (MM/DD/YYYY)
 * @param {string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateShort = date => formatDate(date, DATE_FORMAT_SHORT);

/**
 * Format date in long format (MMMM D, YYYY)
 * @param {string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateLong = date => formatDate(date, DATE_FORMAT_LONG);

/**
 * Check if a date string is valid in YYYY-MM-DD format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidFullDate = dateString => {
  if (!dateString) return false;

  const date = moment(dateString, DATE_TEMPLATE, true);
  if (!date.isValid()) return false;

  // Ensure the string matches expected format exactly
  if (dateString !== date.format(DATE_TEMPLATE)) return false;

  // Check year is within reasonable range
  return isValidYearInRange(date.year());
};

/**
 * Validate a year value
 * @param {any} err - Error object (for form validation)
 * @param {string|number} fieldData - Year value to validate
 */
export const isValidYear = (err, fieldData) => {
  const yearPattern = /^\d{4}$/;

  if (!yearPattern.test(fieldData) || !isValidYearInRange(fieldData)) {
    err.addError(
      `Please enter a valid year between ${MIN_VALID_YEAR} and ${MAX_VALID_YEAR}`,
    );
  }
};

/**
 * Validate partial date (year or year-month)
 * @param {string} dateString - Partial date string
 * @returns {boolean} True if valid
 */
export const isValidPartialDate = dateString => {
  if (!dateString) return false;

  // Check if it's just a year
  if (/^\d{4}$/.test(dateString)) {
    return isValidYearInRange(dateString);
  }

  // Check if it's year-month
  const date = moment(dateString, PARTIAL_DATE_FORMAT, true);
  return date.isValid();
};

/**
 * Check if a date has not expired (is today or in the future)
 * @param {string} expirationDate - Date to check
 * @returns {boolean} True if not expired
 */
export const isNotExpired = (expirationDate = '') => {
  if (!expirationDate) return false;
  const expDate = safeMoment(expirationDate);
  return expDate ? moment().isSameOrBefore(expDate, 'day') : false;
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

  const dateOfBirthMoment = safeMoment(dateOfBirth);
  const fieldDateMoment = safeMoment(fieldData);

  if (!dateOfBirthMoment || !fieldDateMoment) return;

  const thirteenthBirthday = dateOfBirthMoment.clone().add(13, 'years');

  if (fieldDateMoment.isBefore(thirteenthBirthday)) {
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

  const separationDate = safeMoment(fieldData);
  if (!separationDate) return;

  // Check service periods
  const servicePeriods = formData?.serviceInformation?.servicePeriods || [];

  servicePeriods.forEach(period => {
    const startDate = safeMoment(period.dateRange?.from);

    if (startDate && separationDate.isBefore(startDate)) {
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

  const startDate = safeMoment(from);
  const endDate = safeMoment(to);

  if (!startDate || !endDate) {
    errors.addError('Please provide valid dates');
    return;
  }

  if (endDate.isBefore(startDate)) {
    errors.addError('End date must be after start date');
  }
};

/**
 * Check if date is in the future
 * @param {any} err - Error object
 * @param {string} fieldData - Date to check
 */
export const isInFuture = (err, fieldData) => {
  const fieldDate = safeMoment(fieldData);

  if (!fieldDate) {
    err.addError('Please provide a valid date');
    return;
  }

  if (fieldDate.isSameOrBefore(moment(), 'day')) {
    err.addError('Start date must be in the future');
  }
};

/**
 * Validate date is less than 180 days in the future
 * @param {any} errors - Errors object
 * @param {string} fieldData - Date to check
 */
export const isLessThan180DaysInFuture = (errors, fieldData) => {
  const enteredDate = safeMoment(fieldData);

  if (!enteredDate) {
    errors.addError('Please provide a valid date');
    return;
  }

  const today = moment().startOf('day');
  const in180Days = moment()
    .add(180, 'days')
    .startOf('day');

  if (enteredDate.isSameOrBefore(today)) {
    errors.addError('Enter a future separation date');
  } else if (enteredDate.isSameOrAfter(in180Days)) {
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

  const startDate = safeMoment(range.from);
  const endDate = safeMoment(range.to);

  if (!startDate || !endDate) return false;

  const datesToCheck = Array.isArray(dates) ? dates : [dates];

  return datesToCheck.every(date => {
    const dateToValidate = safeMoment(date);
    return (
      dateToValidate &&
      dateToValidate.isBetween(startDate, endDate, 'day', '[]')
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
 * Get difference in days between two dates
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @returns {number|null} Difference in days or null if invalid
 */
export const getDiffInDays = (date1, date2) => {
  const firstDate = safeMoment(date1);
  const secondDate = safeMoment(date2);

  if (!firstDate || !secondDate) return null;

  return Math.abs(firstDate.diff(secondDate, 'days'));
};

/**
 * Parse a date string
 * @param {string} dateString - Date to parse
 * @param {string} format - Optional format
 * @returns {moment.Moment|null} Parsed moment object or null
 */
export const parseDate = (dateString, format) => {
  return safeMoment(dateString, format);
};

/**
 * Parse date with specific template
 * @param {string} dateString - Date to parse
 * @returns {moment.Moment|null} Parsed moment object
 */
export const parseDateWithTemplate = dateString => {
  return safeMoment(dateString, DATE_TEMPLATE);
};

/**
 * Check if BDD claim is valid (90-180 days from separation)
 * @param {string} separationDate - Separation date
 * @returns {boolean} True if valid for BDD
 */
export const isBddClaimValid = separationDate => {
  const separationDateMoment = safeMoment(separationDate);
  if (!separationDateMoment) return false;

  const today = moment().startOf('day');
  const daysUntilSeparation = separationDateMoment.diff(today, 'days');

  return daysUntilSeparation >= 90 && daysUntilSeparation <= 180;
};

/**
 * Get BDD separation date error message
 * @param {string} separationDate - Separation date
 * @returns {string|null} Error message or null if valid
 */
export const getBddSeparationDateError = separationDate => {
  const separationDateMoment = safeMoment(separationDate);
  if (!separationDateMoment) return 'Please provide a valid separation date';

  const today = moment().startOf('day');
  const daysUntilSeparation = separationDateMoment.diff(today, 'days');

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
 * @returns {moment.Moment|null} Earliest service date or null if no valid dates
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
    .map(period => moment(period.dateRange.from, 'YYYY-MM-DD'))
    .filter(momentDate => momentDate.isValid());

  if (validPeriods.length === 0) {
    return null;
  }

  // Use the first valid date as initial value and find the earliest
  return validPeriods.reduce(
    (earliestDate, current) =>
      current.isBefore(earliestDate) ? current : earliestDate,
    validPeriods[0],
  );
};

/**
 * Check if treatment date is before service based on date format
 * @param {moment.Moment} treatmentDate - Treatment date
 * @param {moment.Moment} earliestServiceDate - Earliest service date
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
      treatmentDate.diff(earliestServiceDate, 'year') < 0) ||
    (isYearMonth(fieldData) &&
      treatmentDate.diff(earliestServiceDate, 'month') < 0)
  );
};
