import {
  parse,
  parseISO,
  format,
  isValid,
  startOfDay,
  isAfter,
  addDays,
  addMonths,
  addYears,
  addWeeks,
  addHours,
  addMinutes,
  addSeconds,
} from 'date-fns';

// Local display format equivalent to moment's 'LL' (e.g., "January 1, 2021")
const DATE_DISPLAY_FORMAT = 'MMMM d, yyyy';

/**
 * Form integration utilities for date handling
 * These functions ensure compatibility with the VA forms system
 */

/**
 * Convert form date field object to ISO date string
 * @param {Object} dateField - Form date field with month, day, year properties
 * @param {Object} options - Optional configuration
 * @param {boolean} options.allowPartial - Whether to allow partial dates (XX placeholders). Defaults to false.
 *                                          Only set to true for fields that explicitly support approximate dates
 *                                          (e.g., conditionDate, vaMedicalRecords treatment dates).
 * @returns {string|null} ISO date string (YYYY-MM-DD) or null if invalid/incomplete
 */
export const dateFieldToISO = (dateField, options = {}) => {
  if (!dateField) return null;

  const { allowPartial = false } = options;
  const { month, day, year } = dateField;

  const monthStr = String(month?.value || month || '');
  const dayStr = String(day?.value || day || '');
  const yearStr = String(year?.value || year || '');

  // Check if any component is missing or is an XX placeholder
  const isMonthMissing = !monthStr || monthStr === 'XX';
  const isDayMissing = !dayStr || dayStr === 'XX';
  const isYearMissing = !yearStr || yearStr === 'XXXX';

  // If any component is missing
  if (isMonthMissing || isDayMissing || isYearMissing) {
    // Only create XX placeholders for fields that explicitly allow partial dates
    if (allowPartial) {
      // Reject invalid pattern: year+day only (month missing but day and year present)
      // This pattern is unnatural and not supported
      if (isMonthMissing && !isDayMissing && !isYearMissing) {
        return null;
      }

      const monthFinal = isMonthMissing ? 'XX' : monthStr;
      const dayFinal = isDayMissing ? 'XX' : dayStr;
      const yearFinal = isYearMissing ? 'XXXX' : yearStr;
      return `${yearFinal}-${monthFinal.padStart(2, '0')}-${dayFinal.padStart(
        2,
        '0',
      )}`;
    }
    // For all other fields, return null to indicate incomplete date
    return null;
  }

  // Validate and format complete date
  const iso = `${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(
    2,
    '0',
  )}`;
  const parsed = parse(iso, 'yyyy-MM-dd', new Date());
  // Ensure parsed date is valid and matches the input (strict parsing)
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === iso
    ? format(parsed, 'yyyy-MM-dd')
    : null;
};

/**
 * Convert ISO date string to form date field object
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {Object} Form date field object with month, day, year
 */
export const isoToDateField = isoDate => {
  if (!isoDate || typeof isoDate !== 'string') {
    return { month: '', day: '', year: '' };
  }

  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return { month: '', day: '', year: '' };
  }

  const [year, month, day] = parts;

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
 * @returns {string} Formatted date for display
 */
export const formatReviewDate = (dateString, monthYear = false) => {
  if (!dateString) return '';

  // Handle partial dates
  if (dateString.includes('XX')) {
    const parts = dateString.split('-');
    const [year, month] = parts;

    if (year !== 'XXXX' && month !== 'XX') {
      const parsed = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());
      return isValid(parsed) ? format(parsed, 'MMMM yyyy') : dateString;
    }

    if (year !== 'XXXX') {
      return year;
    }

    return dateString;
  }

  const parsed = parseISO(dateString);
  if (!isValid(parsed)) return dateString;

  return monthYear
    ? format(parsed, 'MMMM yyyy')
    : format(parsed, DATE_DISPLAY_FORMAT);
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
const validateISOFormat = isoDate => {
  if (!isoDate || isoDate.includes('XXXX')) {
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

  const parsed = parse(isoDate, 'yyyy-MM-dd', new Date());
  if (!isValid(parsed)) {
    return { isValid: false, error: 'Please provide a valid date' };
  }

  const today = startOfDay(new Date());

  if (futureOnly && !isAfter(parsed, today)) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  if (pastOnly && isAfter(parsed, today)) {
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
  const isoDate = dateFieldToISO(dateField, options);

  // Validate ISO format
  const formatError = validateISOFormat(isoDate);
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
 * @param {Object} options - Optional configuration
 * @param {boolean} options.allowPartial - Whether to allow partial dates (XX placeholders)
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

  const fromResult = validateFormDateField(fromField, options);
  if (!fromResult.isValid) {
    return { isValid: false, error: `Start date: ${fromResult.error}` };
  }

  const toResult = validateFormDateField(toField, options);
  if (!toResult.isValid) {
    return { isValid: false, error: `End date: ${toResult.error}` };
  }

  // Check range validity at the granularity available
  const fromISO = dateFieldToISO(fromField, options);
  const toISO = dateFieldToISO(toField, options);

  if (fromISO && toISO) {
    // For complete dates, do full validation
    if (!fromISO.includes('XX') && !toISO.includes('XX')) {
      const fromDate = parseISO(fromISO);
      const toDate = parseISO(toISO);

      if (isAfter(fromDate, toDate)) {
        result.isValid = false;
        result.error = 'End date must be after start date';
      }
    } else {
      // For partial dates, validate at the granularity we have
      // Extract year, month, day from ISO strings
      const [fromYear, fromMonth, fromDay] = fromISO.split('-');
      const [toYear, toMonth, toDay] = toISO.split('-');

      // Compare years if both are known
      if (fromYear !== 'XXXX' && toYear !== 'XXXX') {
        if (parseInt(fromYear, 10) > parseInt(toYear, 10)) {
          result.isValid = false;
          result.error = 'End date must be after start date';
          return result;
        }
        // If years are equal, compare months if both are known
        if (fromYear === toYear && fromMonth !== 'XX' && toMonth !== 'XX') {
          if (parseInt(fromMonth, 10) > parseInt(toMonth, 10)) {
            result.isValid = false;
            result.error = 'End date must be after start date';
            return result;
          }
          // If years and months are equal, compare days if both are known
          if (
            fromMonth === toMonth &&
            fromDay !== 'XX' &&
            toDay !== 'XX' &&
            parseInt(fromDay, 10) > parseInt(toDay, 10)
          ) {
            result.isValid = false;
            result.error = 'End date must be after start date';
          }
        }
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
  const today = new Date();
  return {
    month: format(today, 'M'),
    day: format(today, 'd'),
    year: format(today, 'yyyy'),
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
  if (!isoDate || isoDate.includes('XX')) {
    return dateField;
  }

  const date = parseISO(isoDate);
  if (!isValid(date)) {
    return dateField;
  }

  let adjusted;
  switch (unit) {
    case 'days':
      adjusted = addDays(date, amount);
      break;
    case 'months':
      adjusted = addMonths(date, amount);
      break;
    case 'years':
      adjusted = addYears(date, amount);
      break;
    case 'weeks':
      adjusted = addWeeks(date, amount);
      break;
    case 'hours':
      adjusted = addHours(date, amount);
      break;
    case 'minutes':
      adjusted = addMinutes(date, amount);
      break;
    case 'seconds':
      adjusted = addSeconds(date, amount);
      break;
    default:
      return dateField;
  }

  return {
    month: format(adjusted, 'M'),
    day: format(adjusted, 'd'),
    year: format(adjusted, 'yyyy'),
  };
};
