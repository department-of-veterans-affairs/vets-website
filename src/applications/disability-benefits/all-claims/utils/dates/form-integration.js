/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/start-of */
import moment from 'moment';
import { DATE_FORMAT } from './formatting';

/**
 * Form integration utilities for date handling
 * These functions ensure compatibility with the VA forms system
 */

/**
 * Convert form date field object to ISO date string
 * @param {Object} dateField - Form date field with month, day, year properties
 * @param {Object} options - Options object with allowPartialDates flag
 * @returns {string|null} ISO date string (YYYY-MM-DD) or null if invalid
 */
export const dateFieldToISO = (dateField, options = {}) => {
  if (!dateField) return null;

  const { allowPartialDates = false } = options;
  const { month, day, year } = dateField;

  const monthValue = month?.value || month || '';
  const dayValue = day?.value || day || '';
  const yearValue = year?.value || year || '';

  // If partial dates are not allowed, require all fields
  if (!allowPartialDates) {
    if (!monthValue || !dayValue || !yearValue) {
      return null;
    }
    // Validate and format complete date
    // eslint-disable-next-line prettier/prettier
    const date = moment(`${yearValue}-${monthValue.padStart(2, '0')}-${dayValue.padStart(2, '0')}`, 'YYYY-MM-DD', true);
    return date.isValid() ? date.format('YYYY-MM-DD') : null;
  }

  // If partial dates are allowed, enforce valid partial date patterns:
  // 1. Complete date (year + month + day)
  // 2. Month + Year only (no day)
  // 3. Year only (no month or day)
  if (yearValue && monthValue && dayValue) {
    // Complete date
    // eslint-disable-next-line prettier/prettier
    const date = moment(`${yearValue}-${monthValue.padStart(2, '0')}-${dayValue.padStart(2, '0')}`, 'YYYY-MM-DD', true);
    return date.isValid() ? date.format('YYYY-MM-DD') : null;
  }

  if (yearValue && monthValue && !dayValue) {
    // Month + Year only
    return `${yearValue}-${monthValue.padStart(2, '0')}-XX`;
  }

  if (yearValue && !monthValue && !dayValue) {
    // Year only
    return `${yearValue}-XX-XX`;
  }

  // Invalid partial date pattern (e.g., day without month)
  return null;
};

/**
 * Convert ISO date string to form date field object
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @param {Object} options - Options object with allowPartialDates flag
 * @returns {Object} Form date field object with month, day, year
 */
export const isoToDateField = (isoDate, options = {}) => {
  if (!isoDate || typeof isoDate !== 'string') {
    return { month: '', day: '', year: '' };
  }

  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return { month: '', day: '', year: '' };
  }

  const [year, month, day] = parts;
  const { allowPartialDates = false } = options;

  // If partial dates are not allowed and we detect XX patterns, return empty
  if (
    !allowPartialDates &&
    (year === 'XXXX' || month === 'XX' || day === 'XX')
  ) {
    return { month: '', day: '', year: '' };
  }

  // If partial dates are allowed, validate the pattern
  if (
    allowPartialDates &&
    (year === 'XXXX' || month === 'XX' || day === 'XX')
  ) {
    // Only allow valid partial date patterns:
    // 1. Month + Year (day is XX): YYYY-MM-XX
    // 2. Year only (month and day are XX): YYYY-XX-XX
    // Invalid: day without month (YYYY-XX-DD) or month without year (XXXX-MM-DD)

    if (year !== 'XXXX' && month !== 'XX' && day === 'XX') {
      // Valid: Month + Year pattern
      return {
        month: month.replace(/^0/, ''),
        day: '',
        year,
      };
    }

    if (year !== 'XXXX' && month === 'XX' && day === 'XX') {
      // Valid: Year only pattern
      return {
        month: '',
        day: '',
        year,
      };
    }

    // Invalid partial pattern - return empty
    return { month: '', day: '', year: '' };
  }

  // Complete date or no XX patterns
  return {
    month: month === 'XX' ? '' : month.replace(/^0/, ''),
    day: day === 'XX' ? '' : day.replace(/^0/, ''),
    year: year === 'XXXX' ? '' : year,
  };
};

/**
 * Format date for review display in forms
 * @param {string} dateString - ISO date string
 * @param {boolean} monthYear - If true, only show month and year
 * @param {Object} options - Options object with allowPartialDates flag
 * @returns {string} Formatted date for display
 */
export const formatReviewDate = (
  dateString,
  monthYear = false,
  options = {},
) => {
  if (!dateString) return '';

  const { allowPartialDates = false } = options;

  // Handle partial dates only if allowed
  if (dateString.includes('XX')) {
    if (!allowPartialDates) {
      return '';
    }

    const parts = dateString.split('-');
    const [year, month, day] = parts;

    // Reject invalid partial date patterns:
    // 1. Month without year (XXXX-MM-XX or XXXX-MM-DD)
    // 2. Day without month (YYYY-XX-DD or XXXX-XX-DD)
    if (year === 'XXXX' || (month === 'XX' && day !== 'XX')) {
      return '';
    }

    // Valid patterns:
    // 1. Year + Month (YYYY-MM-XX)
    if (year !== 'XXXX' && month !== 'XX' && day === 'XX') {
      const date = moment(`${year}-${month}-01`);
      return date.isValid() ? date.format('MMMM YYYY') : '';
    }

    // 2. Year only (YYYY-XX-XX)
    if (year !== 'XXXX' && month === 'XX' && day === 'XX') {
      return year;
    }

    // Any other pattern is invalid
    return '';
  }

  const date = moment(dateString);
  if (!date.isValid()) return dateString;

  return monthYear ? date.format('MMMM YYYY') : date.format(DATE_FORMAT);
};

/**
 * Check if date field meets required conditions
 * @private
 */
const checkRequiredField = (dateField, required, monthYearOnly) => {
  if (!required) return { isValid: true, error: null };

  const hasRequiredFields =
    dateField?.year && dateField?.month && (monthYearOnly || dateField?.day);

  if (!hasRequiredFields) {
    return {
      isValid: false,
      error: monthYearOnly
        ? 'Please provide month and year'
        : 'Please provide a complete date',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Check if date field is empty
 * @private
 */
const isEmptyDateField = dateField => {
  return !dateField?.year && !dateField?.month && !dateField?.day;
};

/**
 * Validate ISO date format
 * @private
 */
const validateISOFormat = (isoDate, allowPartialDates = false) => {
  if (!isoDate) {
    return { isValid: false, error: 'Please provide a valid date' };
  }

  if (isoDate.includes('XX') && !allowPartialDates) {
    return { isValid: false, error: 'Please provide a valid date' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate complete date and check temporal constraints
 * @private
 */
const validateCompleteDateConstraints = (isoDate, futureOnly, pastOnly) => {
  if (isoDate.includes('XX')) return { isValid: true, error: null };

  const date = moment(isoDate, 'YYYY-MM-DD', true);
  if (!date.isValid()) {
    return { isValid: false, error: 'Please provide a valid date' };
  }

  const today = moment().startOf('day');

  if (futureOnly && date.isSameOrBefore(today)) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  if (pastOnly && date.isAfter(today)) {
    return { isValid: false, error: 'Date must be in the past' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate form date field
 * @param {Object} dateField - Form date field object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateFormDateField = (dateField, options = {}) => {
  const {
    required = false,
    futureOnly = false,
    pastOnly = false,
    monthYearOnly = false,
    allowPartialDates = false,
  } = options;

  // Check required fields
  const requiredError = checkRequiredField(dateField, required, monthYearOnly);
  if (!requiredError.isValid) {
    return requiredError;
  }

  // If not required and empty, it's valid
  if (isEmptyDateField(dateField)) {
    return { isValid: true, error: null };
  }

  // Convert to ISO format
  const isoDate = dateFieldToISO(dateField, { allowPartialDates });

  // Validate ISO format
  const formatError = validateISOFormat(isoDate, allowPartialDates);
  if (!formatError.isValid) {
    return formatError;
  }

  // Validate complete dates with temporal constraints
  const constraintError = validateCompleteDateConstraints(
    isoDate,
    futureOnly,
    pastOnly,
  );

  if (!constraintError.isValid) {
    return constraintError;
  }

  return { isValid: true, error: null };
};

/**
 * Create date range from form date fields
 * @param {Object} fromField - From date field
 * @param {Object} toField - To date field
 * @param {Object} options - Options object with allowPartialDates flag
 * @returns {Object} Date range object with from and to ISO strings
 */
export const createDateRange = (fromField, toField, options = {}) => {
  return {
    from: dateFieldToISO(fromField, options),
    to: dateFieldToISO(toField, options),
  };
};

/**
 * Validate date range from form fields
 * @param {Object} fromField - From date field
 * @param {Object} toField - To date field
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFormDateRange = (fromField, toField, options = {}) => {
  const result = { isValid: true, error: null };
  const { allowPartialDates = false } = options;

  const fromResult = validateFormDateField(fromField, options);
  if (!fromResult.isValid) {
    return { isValid: false, error: `Start date: ${fromResult.error}` };
  }

  const toResult = validateFormDateField(toField, options);
  if (!toResult.isValid) {
    return { isValid: false, error: `End date: ${toResult.error}` };
  }

  // Check range validity if both dates are present
  const fromISO = dateFieldToISO(fromField, { allowPartialDates });
  const toISO = dateFieldToISO(toField, { allowPartialDates });

  if (fromISO && toISO) {
    // Only validate range if both dates are complete (no XX patterns)
    const bothComplete = !fromISO.includes('XX') && !toISO.includes('XX');

    if (bothComplete) {
      const fromDate = moment(fromISO);
      const toDate = moment(toISO);

      if (fromDate.isAfter(toDate)) {
        result.isValid = false;
        result.error = 'End date must be after start date';
      }
    }
  }

  return result;
};

/**
 * Get current date as form field object
 * @returns {Object} Current date as form field
 */
export const getCurrentFormDate = () => {
  const today = moment();
  return {
    month: today.format('M'),
    day: today.format('D'),
    year: today.format('YYYY'),
  };
};

/**
 * Add/subtract time from form date field
 * @param {Object} dateField - Form date field
 * @param {number} amount - Amount to add/subtract
 * @param {string} unit - Unit (days, months, years)
 * @returns {Object} New form date field
 */
export const adjustFormDate = (dateField, amount, unit) => {
  // Validate amount parameter
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return dateField;
  }

  // Validate unit parameter - only accept valid moment.js units
  const validUnits = [
    'days',
    'months',
    'years',
    'weeks',
    'hours',
    'minutes',
    'seconds',
  ];
  if (typeof unit !== 'string' || !validUnits.includes(unit)) {
    return dateField;
  }

  const isoDate = dateFieldToISO(dateField);
  if (!isoDate) {
    return dateField;
  }

  const date = moment(isoDate);
  if (!date.isValid()) {
    return dateField;
  }

  const adjusted = date.add(amount, unit);
  return {
    month: adjusted.format('M'),
    day: adjusted.format('D'),
    year: adjusted.format('YYYY'),
  };
};
