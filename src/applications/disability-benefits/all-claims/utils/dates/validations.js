import { parseISO, isValid, parse, add, format } from 'date-fns';
import { isDateBefore, isDateAfter, isDateSame } from './comparisons';

/**
 * Internal utility to safely create date-fns date objects
 * @private
 */
const safeFnsDate = date => {
  if (!date) return null;
  // Check if the date string contains only non-date characters to avoid parsing errors
  if (typeof date === 'string' && !/\d/.test(date)) {
    return null;
  }

  // Handle Date objects
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }

  // Try parsing as ISO string first (only if it looks like ISO format)
  let parsedDate = null;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // Try common date formats with a consistent reference date
  const referenceDate = new Date();
  const formats = ['MM/dd/yyyy', 'yyyy-MM-dd', 'MM-dd-yyyy'];
  for (const dateFormat of formats) {
    parsedDate = parse(date, dateFormat, referenceDate);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return null;
};

/**
 * Validate that a date is not before a reference date
 * @param {Object} errors - Errors object
 * @param {string} date - Date to validate
 * @param {string} referenceDate - Reference date
 * @param {Object} options - Optional validation options
 */
export const validateDateNotBeforeReference = (
  errors,
  date,
  referenceDate,
  options = {},
) => {
  const { inclusive = true, customMessage = null } = options;

  const dateToCheck = safeFnsDate(date);
  const refDate = safeFnsDate(referenceDate);

  if (!dateToCheck) {
    errors.addError('Please provide a valid date');
    return;
  }

  if (!refDate) {
    errors.addError('Invalid reference date');
    return;
  }

  const isBeforeRef = inclusive
    ? isDateBefore(dateToCheck, refDate)
    : isDateBefore(dateToCheck, refDate) || isDateSame(dateToCheck, refDate);

  if (isBeforeRef) {
    errors.addError(
      customMessage ||
        `Date must be ${inclusive ? 'on or ' : ''}after ${format(
          refDate,
          'MM/dd/yyyy',
        )}`,
    );
  }
};

/**
 * Validates separation date considering BDD rules and reserve status
 * @param {Object} errors - Errors object
 * @param {string} dateString - Separation date
 * @param {Object} options - Validation options
 */
export const validateSeparationDateWithRules = (
  errors,
  dateString,
  options = {},
) => {
  const { isBDD = false, isReserves = false } = options;

  const separationDate = safeFnsDate(dateString);
  if (!separationDate) {
    errors.addError(
      `The separation date provided (${dateString}) is not a real date.`,
    );
    return;
  }

  const now = new Date();
  const in90Days = add(now, { days: 90 });
  const in180Days = add(now, { days: 180 });

  if (isBDD) {
    if (isDateAfter(separationDate, in180Days)) {
      errors.addError(
        'Your separation date must be before 180 days from today',
      );
      return;
    }
    // BDD allows dates up to 180 days in the future, no additional validation needed
    return;
  }

  // Non-BDD validation rules
  if (isDateAfter(separationDate, in180Days)) {
    errors.addError(
      'You entered a date more than 180 days from now. If you are wanting to apply for the Benefits Delivery at Discharge program, you will need to wait.',
    );
    return;
  }

  // For non-BDD, non-reserves: date must be in the past (more than 90 days ago)
  if (
    !isReserves &&
    (isDateAfter(separationDate, in90Days) ||
      isDateSame(separationDate, in90Days))
  ) {
    errors.addError('Your separation date must be in the past');
  }
};

/**
 * Validates Title 10 activation dates for reserves/guard
 * @param {Object} errors - Errors object
 * @param {string} activationDate - Activation date
 * @param {Array} servicePeriods - Array of service periods
 * @param {Array} reservesList - List of reserve/guard types to match
 */
export const validateTitle10ActivationDate = (
  errors,
  activationDate,
  servicePeriods = [],
  reservesList = [],
) => {
  const activation = safeFnsDate(activationDate);
  if (!activation) {
    errors.addError('Please provide a valid activation date');
    return;
  }

  const now = new Date();
  if (isDateAfter(activation, now)) {
    errors.addError('Enter an activation date in the past');
    return;
  }

  const reserveGuardPeriods = servicePeriods.filter(period =>
    reservesList.some(match => period.serviceBranch === match),
  );

  if (reserveGuardPeriods.length === 0) return;

  const earliestStart = reserveGuardPeriods
    .map(period => period.dateRange?.from)
    .filter(date => date)
    .sort((a, b) => {
      const dateA = safeFnsDate(a);
      const dateB = safeFnsDate(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    })[0];

  if (earliestStart) {
    const earliestStartDate = safeFnsDate(earliestStart);
    if (earliestStartDate && isDateBefore(activation, earliestStartDate)) {
      errors.addError(
        'Your activation date must be after your earliest service start date for the Reserve or the National Guard',
      );
    }
  }
};

/**
 * Validate approximate/partial date - supports year-only, year-month, or full date
 * Aligns with Conditions approach for handling approximate dates
 * @param {Object} errors - Errors object
 * @param {string} dateString - Date string in format YYYY-MM-DD or with XX placeholders
 * @param {Object} options - Validation options
 * @param {boolean} options.allowPartial - Allow partial dates (year-only or year-month). Defaults to true
 * @param {number} options.minYear - Minimum valid year. Defaults to 1900
 * @param {number} options.maxYear - Maximum valid year. Defaults to current year
 */
export const validateApproximateDate = (errors, dateString, options = {}) => {
  const {
    allowPartial = true,
    minYear = 1900,
    maxYear = new Date().getFullYear(),
  } = options;

  if (!dateString) return;

  const [year, month, day] = dateString.split('-');
  const isYearValid = year && year !== 'XXXX';
  const isMonthValid = month && month !== 'XX';
  const isDayValid = day && day !== 'XX';

  if (allowPartial) {
    // Conditions pattern: allow year-only, year-month, or full date
    const isValidDateFormat =
      (isYearValid && !isMonthValid && !isDayValid) || // Year only
      (isYearValid && isMonthValid && !isDayValid) || // Year + Month
      (isYearValid && isMonthValid && isDayValid); // Full date

    if (!isValidDateFormat) {
      errors.addError(
        'Enter a year only (e.g., 1988), a month and year (e.g., June 1988), or a full date (e.g., June 1 1988)',
      );
      return;
    }
  } else if (!isYearValid || !isMonthValid || !isDayValid) {
    // Toxic Exposure pattern: require all parts
    errors.addError(
      'Enter a service date that includes the month, day, and year',
    );
    return;
  }

  // Validate year range
  const y = Number(year);
  if (!Number.isInteger(y) || y < minYear || y > maxYear) {
    errors.addError(`Please enter a year between ${minYear} and ${maxYear}`);
    return;
  }

  // Validate month if present
  if (isMonthValid) {
    const m = Number(month);
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      errors.addError('Please enter a valid month');
      return;
    }
  }

  // Validate day if present
  if (isDayValid) {
    const d = Number(day);
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      errors.addError('Please enter a valid day');
      return;
    }
  }

  // Validate that the day is valid for the given month and year
  if (isYearValid && isMonthValid && isDayValid) {
    const yearNum = Number(year);
    const monthNum = Number(month);
    const dayNum = Number(day);
    // JavaScript Date: months are 0-based
    const constructedDate = new Date(yearNum, monthNum - 1, dayNum);
    if (
      constructedDate.getFullYear() !== yearNum ||
      constructedDate.getMonth() !== monthNum - 1 ||
      constructedDate.getDate() !== dayNum
    ) {
      errors.addError(
        'Please enter a valid date for the selected month and year',
      );
      return;
    }

    // Validate it's not a future date
    const now = new Date();
    if (isDateAfter(constructedDate, now)) {
      errors.addError('Please enter a date that is not in the future');
    }
  }
};

/**
 * Validate month/year-only date - supports year-only or year+month
 * Neither year nor month is required, but if month is provided, year is also required
 * Format: YYYY-XX (year-only) or YYYY-MM (year+month)
 * Full dates (YYYY-MM-DD) are accepted for backward compatibility,
 * but the day portion is intentionally ignored - only year and month are validated.
 * @param {Object} errors - Errors object
 * @param {string} dateString - Date string in format YYYY-MM, YYYY-XX, or YYYY-MM-DD
 */
export const validateApproximateMonthYearDate = (errors, dateString) => {
  // Empty is OK - field is not required
  if (!dateString) return;

  // Split on '-' and extract only year and month (ignore day portion if present)
  const [year, month] = dateString.split('-');
  const isMonthValid = month && month !== 'XX' && month !== '';
  const isYearMissing = !year || year === 'XXXX' || year === '';

  // Parse year as number if it exists and is not XXXX
  const yearNum = year && year !== 'XXXX' && year !== '' ? Number(year) : null;

  // If year is present but not a valid integer, show generic error
  if (yearNum !== null && !Number.isInteger(yearNum)) {
    errors.addError('Please enter a valid date');
    return;
  }

  // Check for month-only input FIRST
  if (isMonthValid && isYearMissing) {
    errors.addError('You must enter a year if you select a month');
    return;
  }

  // Validate year range (1900 to current year)
  const minYear = 1900;
  const currentYear = new Date().getFullYear();
  if (
    yearNum !== null &&
    Number.isInteger(yearNum) &&
    (yearNum < minYear || yearNum > currentYear)
  ) {
    errors.addError(
      `Please enter a year between ${minYear} and ${currentYear}`,
    );
    return;
  }

  // Check format: allow year-only (YYYY-XX) or year-month (YYYY-MM)
  const hasValidYear = yearNum !== null && Number.isInteger(yearNum);
  const isValidFormat =
    (hasValidYear && !isMonthValid) || (hasValidYear && isMonthValid);

  if (!isValidFormat) {
    errors.addError(
      'Enter a year only (e.g., 1988) or a month and year (e.g., June 1988)',
    );
    return;
  }

  // Validate month if present
  if (isMonthValid) {
    const m = Number(month);
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      errors.addError('Please enter a valid month');
    }
  }
};
