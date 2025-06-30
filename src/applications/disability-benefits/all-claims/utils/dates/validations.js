/* eslint-disable you-dont-need-momentjs/diff */
/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/start-of */
/* eslint-disable you-dont-need-momentjs/add */
import moment from 'moment';

/**
 * Internal utility to safely create moment objects
 * @private
 */
const safeMoment = date => {
  if (!date) return null;
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate : null;
};

/**
 * Check if both dates are missing when required
 * @private
 */
const checkRequiredDates = (from, to, required, customMessage) => {
  return required && (!from || !to)
    ? customMessage || 'Please provide both start and end dates'
    : null;
};

/**
 * Validate date values and check if they are valid moment objects
 * @private
 */
const validateDateValues = (from, to) => {
  const startDate = safeMoment(from);
  const endDate = safeMoment(to);

  if ((from && !startDate) || (to && !endDate)) {
    return { error: 'Please provide valid dates' };
  }

  return { startDate, endDate };
};

/**
 * Check date range logic (order and day differences)
 * @private
 */
const checkDateRangeLogic = (startDate, endDate, maxDays, minDays, errors) => {
  if (!startDate || !endDate) return;

  if (endDate.isBefore(startDate)) {
    errors.addError('End date must be after start date');
    return;
  }

  const daysDiff = endDate.diff(startDate, 'days');

  if (maxDays !== null && daysDiff > maxDays) {
    errors.addError(`Date range cannot exceed ${maxDays} days`);
  }

  if (minDays !== null && daysDiff < minDays) {
    errors.addError(`Date range must be at least ${minDays} days`);
  }
};

/**
 * Validate a date range
 * @param {Object} errors - Errors object
 * @param {Object} dateRange - Object with from and to dates
 * @param {Object} options - Optional validation options
 */
export const validateDateRange = (errors, dateRange, options = {}) => {
  const { from, to } = dateRange || {};
  const {
    required = true,
    maxDays = null,
    minDays = null,
    customMessage = null,
  } = options;

  // Check required dates
  const requiredError = checkRequiredDates(from, to, required, customMessage);
  if (requiredError) {
    errors.addError(requiredError);
    return;
  }

  // Both empty and not required - valid case
  if (!from && !to) return;

  // Validate date values
  const dateValidation = validateDateValues(from, to);
  if (dateValidation.error) {
    errors.addError(dateValidation.error);
    return;
  }

  // Check date range logic
  checkDateRangeLogic(
    dateValidation.startDate,
    dateValidation.endDate,
    maxDays,
    minDays,
    errors,
  );
};

/**
 * Validate that a date is in the future
 * @param {Object} errors - Errors object
 * @param {string} date - Date to validate
 * @param {Object} options - Optional validation options
 */
export const validateFutureDate = (errors, date, options = {}) => {
  const {
    inclusive = false,
    customMessage = null,
    maxDaysInFuture = null,
  } = options;

  const dateToCheck = safeMoment(date);
  if (!dateToCheck) {
    errors.addError('Please provide a valid date');
    return;
  }

  const today = moment().startOf('day');
  const comparison = inclusive ? 'isBefore' : 'isSameOrBefore';

  if (dateToCheck[comparison](today)) {
    errors.addError(customMessage || 'Date must be in the future');
    return;
  }

  if (maxDaysInFuture !== null) {
    const maxDate = moment()
      .add(maxDaysInFuture, 'days')
      .startOf('day');
    if (dateToCheck.isAfter(maxDate)) {
      errors.addError(`Date must be within ${maxDaysInFuture} days from today`);
    }
  }
};

/**
 * Validate that a date is in the past
 * @param {Object} errors - Errors object
 * @param {string} date - Date to validate
 * @param {Object} options - Optional validation options
 */
export const validatePastDate = (errors, date, options = {}) => {
  const { inclusive = true, customMessage = null, minDate = null } = options;

  const dateToCheck = safeMoment(date);
  if (!dateToCheck) {
    errors.addError('Please provide a valid date');
    return;
  }

  const today = moment().startOf('day');
  const comparison = inclusive ? 'isAfter' : 'isSameOrAfter';

  if (dateToCheck[comparison](today)) {
    errors.addError(customMessage || 'Date must be in the past');
    return;
  }

  if (minDate) {
    const minDateMoment = safeMoment(minDate);
    if (minDateMoment && dateToCheck.isBefore(minDateMoment)) {
      errors.addError(
        `Date must be on or after ${minDateMoment.format('MM/DD/YYYY')}`,
      );
    }
  }
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

  const dateToCheck = safeMoment(date);
  const refDate = safeMoment(referenceDate);

  if (!dateToCheck) {
    errors.addError('Please provide a valid date');
    return;
  }

  if (!refDate) {
    errors.addError('Invalid reference date');
    return;
  }

  const comparison = inclusive ? 'isBefore' : 'isSameOrBefore';

  if (dateToCheck[comparison](refDate)) {
    errors.addError(
      customMessage ||
        `Date must be ${inclusive ? 'on or ' : ''}after ${refDate.format(
          'MM/DD/YYYY',
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

  const separationDate = safeMoment(dateString);
  if (!separationDate) {
    errors.addError(
      `The separation date provided (${dateString}) is not a real date.`,
    );
    return;
  }

  const in90Days = moment().add(90, 'days');
  const in180Days = moment().add(180, 'days');

  // BDD validation rules
  if (isBDD) {
    if (separationDate.isAfter(in180Days)) {
      errors.addError(
        'Your separation date must be before 180 days from today',
      );
      return;
    }
    // BDD allows dates up to 180 days in the future, no additional validation needed
    return;
  }

  // Non-BDD validation rules
  if (separationDate.isAfter(in180Days)) {
    errors.addError(
      'You entered a date more than 180 days from now. If you are wanting to apply for the Benefits Delivery at Discharge program, you will need to wait.',
    );
    return;
  }

  // For non-BDD, non-reserves: date must be in the past (more than 90 days ago)
  if (!isReserves && separationDate.isSameOrAfter(in90Days)) {
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
  const activation = safeMoment(activationDate);
  if (!activation) {
    errors.addError('Please provide a valid activation date');
    return;
  }

  if (activation.isAfter(moment())) {
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
    .sort((a, b) => moment(a).diff(moment(b)))[0];

  if (earliestStart && activation.isBefore(moment(earliestStart))) {
    errors.addError(
      'Your activation date must be after your earliest service start date for the Reserve or the National Guard',
    );
  }
};
