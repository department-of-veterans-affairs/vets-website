import moment from 'moment';
import { validateCurrentOrPastDate } from 'platform/forms-system/src/js/validation';
import content from '../locales/en/content.json';

/**
 * HACK: Due to us-forms-system issue 269 (https://github.com/usds/us-forms-system/issues/269)
 * Validate input data against regex for propery currency formatting
 *
 * Source: https://stackoverflow.com/a/16242575
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the text input field
 */
export function validateCurrency(errors, fieldData) {
  const CURRENCY_FORMAT_REGEX = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
  if (!CURRENCY_FORMAT_REGEX.test(fieldData)) {
    errors.addError(content['validation-currency-format']);
  }
}

/**
 * Validate input data to ensure dependent data is on or after the dependents
 * date of birth
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the text input field
 * @param {Object} - formData - the entire form data object
 */
export function validateDependentDate(errors, fieldData, { dateOfBirth }) {
  const dependentDate = moment(fieldData);
  const birthDate = moment(dateOfBirth);

  if (birthDate.isAfter(dependentDate)) {
    errors.addError(content['validation-dependent-date']);
  }
  validateCurrentOrPastDate(errors, fieldData);
}

/**
 * Validate insurance information to ensure either a policy number or group
 * code is provided
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the view field
 */
export function validatePolicyNumberGroupCode(errors, fieldData) {
  const { insurancePolicyNumber, insuranceGroupCode } = fieldData;
  if (!insurancePolicyNumber && !insuranceGroupCode) {
    errors.insuranceGroupCode.addError(
      content['validation-insurance-group-code'],
    );
    errors.insurancePolicyNumber.addError(
      content['validation-insurance-policy-number'],
    );
  }
}
