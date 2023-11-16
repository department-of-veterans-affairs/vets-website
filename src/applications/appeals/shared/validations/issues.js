import { hasDuplicates, hasSomeSelected } from '../utils/issues';
import { noneSelected } from '../content/contestableIssues';
import errorMessages from '../content/errorMessages';
/**
 *
 * @param {Function[]} validations - array of validation functions
 * @param {*} data - field data passed to the validation function
 * @param {*} fullData - full and appStateData passed to validation function
 * @returns {String[]} - error messages
 */
export const checkValidations = (validations, data, fullData) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  validations.map(validation =>
    validation(errors, data, fullData, null, null, null, fullData),
  );
  return errors.errorMessages;
};

export const selectionRequired = (
  errors,
  _fieldData,
  formData = {},
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  // formData === pageData on review & submit page. It should include the entire
  // formData. see https://github.com/department-of-veterans-affairs/vsp-support/issues/162
  // Fall back to formData for unit testing
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;
  if (errors && !hasSomeSelected(data)) {
    errors.addError(noneSelected);
  }
};

// Alert Veteran to duplicates based on name & decision date
export const uniqueIssue = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (errors?.addError && hasDuplicates(appStateData || formData)) {
    errors.addError(errorMessages.uniqueIssue);
  }
};
