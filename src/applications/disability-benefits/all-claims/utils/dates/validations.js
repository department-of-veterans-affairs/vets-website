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
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
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
