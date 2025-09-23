import { isValid } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

/**
 * Validates an applicant's date of marriage to sponsor is not before
 * said applicant's date of birth.
 * @param {Object} errors - The errors object for the current page
 * @param {Object} page - The current page data
 */
export const validateMarriageAfterDob = (errors, page) => {
  const difference =
    Date.parse(page?.dateOfMarriageToSponsor) - Date.parse(page?.applicantDob);

  if (difference !== undefined && difference <= 0) {
    errors.dateOfMarriageToSponsor.addError(
      'Date of marriage must be after applicant’s date of birth',
    );
  }
};

/**
 * Validates Medicare termination date not before the effective date
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 */
export const validateMedicarePartDDates = (errors, data) => {
  const { medicarePartDEffectiveDate, medicarePartDTerminationDate } = data;
  const fromDate = convertToDateField(medicarePartDEffectiveDate);
  const toDate = convertToDateField(medicarePartDTerminationDate);

  if (
    medicarePartDTerminationDate &&
    !isValid(new Date(medicarePartDTerminationDate))
  ) {
    errors.medicarePartDTerminationDate.addError(
      'Please enter a valid current or past date',
    );
  }

  if (!isValidDateRange(fromDate, toDate)) {
    errors.medicarePartDTerminationDate.addError(
      'Termination date must be after the effective date',
    );
  }
};

/**
 * Validates Other Health Insurance termination date not before the effective date
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 */
export const validateOHIDates = (errors, data) => {
  const { effectiveDate, expirationDate } = data;
  const fromDate = convertToDateField(effectiveDate);
  const toDate = convertToDateField(expirationDate);

  if (expirationDate && !isValid(new Date(expirationDate))) {
    errors.expirationDate.addError('Please enter a valid current or past date');
  }

  if (!isValidDateRange(fromDate, toDate)) {
    errors.expirationDate.addError(
      'Termination date must be after the effective date',
    );
  }
};
