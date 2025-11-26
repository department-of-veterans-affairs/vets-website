import { isValid } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

/**
 * Generic validator for date ranges with effective/termination or effective/expiration date patterns
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 * @param {Object} options - configuration options
 * @param {string} options.effectiveDateKey - key name for the effective/start date field
 * @param {string} options.endDateKey - key name for the termination/expiration/end date field
 * @param {string} [options.invalidDateMessage] - custom error message for invalid dates
 * @param {string} [options.rangeErrorMessage] - custom error message for invalid date range
 */
export const validateDateRange = (errors, data, options = {}) => {
  const {
    startDateKey,
    endDateKey,
    invalidDateMessage = 'Please provide a valid current or past date',
    rangeErrorMessage = 'Termination date must be after the effective date',
  } = options;

  const startDate = data[startDateKey];
  const endDate = data[endDateKey];

  const fromDate = convertToDateField(startDate);
  const toDate = convertToDateField(endDate);

  // Validate end date is a valid date if provided
  if (endDate && !isValid(new Date(endDate))) {
    errors[endDateKey].addError(invalidDateMessage);
  }

  // Validate date range (end date must be after effective date)
  if (!isValidDateRange(fromDate, toDate)) {
    errors[endDateKey].addError(rangeErrorMessage);
  }
};
