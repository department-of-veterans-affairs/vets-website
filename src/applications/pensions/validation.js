import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { isValidDateRange } from '@department-of-veterans-affairs/platform-forms/validations';
import { convertToDateField } from '@department-of-veterans-affairs/platform-forms-system/validation';

/**
 * Validates that the date of separation is after the date of marriage.
 * @param {object} errors - form system error object
 * @param {string} dateOfSeparation - date string to validate
 * @param {object} formData - form data object
 * @returns {void}
 */
export function validateAfterMarriageDate(errors, dateOfSeparation, formData) {
  const fromDate = convertToDateField(
    formData['view:pastMarriage']?.dateOfMarriage || formData.dateOfMarriage,
  );
  const toDate = convertToDateField(dateOfSeparation);

  if (!isValidDateRange(fromDate, toDate)) {
    errors.addError('Date marriage ended must be after date of marriage');
  }
}

/**
 * Find date of separation fields in formData and validate it
 * @param {object} errors - form system error object
 * @param {string} dateOfSeparation - date string to validate
 * @param {object} formData - form data object
 * @returns {void}
 */
export function validateAfterMarriageDates(errors, dateOfSeparation, formData) {
  formData.spouseMarriages?.forEach(marriage => {
    if (marriage.dateOfSeparation === dateOfSeparation) {
      validateAfterMarriageDate(errors, dateOfSeparation, marriage);
    }
  });
}

/**
 * Validate if marriage entry is unique by date of marriage
 * @param {object} errors - form system error object
 * @param {string} dateOfMarriage - date string to validate
 * @param {object} formData - form data object
 * @returns {void}
 */
export function validateUniqueMarriageDates(errors, dateOfMarriage, formData) {
  let count = 0;
  formData.spouseMarriages?.forEach(marriage => {
    if (dateOfMarriage === marriage.dateOfMarriage) {
      count += 1;
    }
  });
  if (count > 1) {
    errors.addError('Date of marriage must be unique');
  }
}

/**
 * Validates that the date entering active service is after the birth date
 * @param {object} errors - form system error object
 * @param {object} service - service data object
 * @param {object} formData - form data object
 * @returns {void}
 */
export function validateServiceBirthDates(errors, service, formData) {
  const fromDate = convertToDateField(formData.veteranDateOfBirth);
  const toDate = convertToDateField(
    get('activeServiceDateRange.from', service),
  );

  if (!isValidDateRange(fromDate, toDate)) {
    errors.activeServiceDateRange.from.addError(
      'Date entering active service should be after birth date',
    );
  }
}

export const validateCurrency = (errors, currencyAmount) => {
  const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
  if (!regex.test(currencyAmount) || Number(currencyAmount) < 0) {
    errors.addError('Please enter a valid dollar amount.');
  }
};

// Does not allow a dollar sign
export const isValidCurrency = currencyAmount => {
  const regex = /^(?!.*\$)(([1-9]\d{0,2}(,\d{3})*|\d+)(\.\d{1,2})?)?$/;
  return regex.test(currencyAmount);
};

/**
 * Benefits Intake API metadata name validation only accepts a-z, A-Z, hyphen, and whitespace.
 * When generating the metadata, we erase all invalid characters. If this leaves an empty string,
 * the submission will fail
 * @param {object} errors - form system error object
 * @param {string} value - string to validate
 * @returns {void}
 */
export function validateBenefitsIntakeName(errors, value) {
  const validCharsPattern = /[a-zA-Z]/g;
  const matches = value.match(validCharsPattern);

  if (!matches) {
    errors.addError(`You must include at least one character between A and Z`);
  }
}
