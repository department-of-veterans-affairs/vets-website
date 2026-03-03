import { isValid } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';
import content from '../locales/en/content.json';

/**
 * Validates text field for disallowed characters and add an error message when any are found.
 * @param {Object} errors - The rjsf/vets-forms error object
 * @param {string} fieldData - The input string to validate
 */
export const validateChars = (errors, data) => {
  const invalidCharsPattern = /[~!@#$%^&*+=[\]{}()<>;:"`\\/_|]/g;
  const matches = data.match(invalidCharsPattern);

  if (!matches) return;

  const uniqueChars = [...new Set(matches)];
  const isPlural = uniqueChars.length > 1;
  const charsList = uniqueChars.join(' ');

  const msgPlural = content['validation--text-characters--plural'];
  const msgSingular = content['validation--text-characters--singular'];
  const message = isPlural
    ? `${msgPlural}: ${charsList}`
    : `${msgSingular}: ${charsList}`;

  errors.addError(message);
};

/**
 * Generic validator factory for date ranges with effective/termination or effective/expiration date patterns
 * @param {Object} options - configuration options
 * @param {string} options.startDateKey - key name for the effective/start date field
 * @param {string} options.endDateKey - key name for the termination/expiration/end date field
 * @param {string} [options.invalidDateMessage] - custom error message for invalid dates
 * @param {string} [options.rangeErrorMessage] - custom error message for invalid date range
 * @returns {Function} validator function that accepts (errors, data)
 */
export const validateDateRange = (options = {}) => {
  const {
    startDateKey,
    endDateKey,
    invalidDateMessage = content['validation--date-value--current'],
    rangeErrorMessage = content['validation--date-range'],
  } = options;

  return (errors, data) => {
    const startDate = data[startDateKey];
    const endDate = data[endDateKey];

    const fromDate = convertToDateField(startDate);
    const toDate = convertToDateField(endDate);

    // Validate end date is a valid date, if provided
    if (endDate && !isValid(new Date(endDate))) {
      errors[endDateKey].addError(invalidDateMessage);
      return;
    }

    // Validate date range (end date must be after start date)
    if (!isValidDateRange(fromDate, toDate)) {
      errors[endDateKey].addError(rangeErrorMessage);
    }
  };
};
