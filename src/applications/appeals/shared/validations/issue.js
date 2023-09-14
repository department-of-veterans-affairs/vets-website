import { hasDuplicates, hasSomeSelected } from '../utils/issues';
import { noneSelected } from '../content/contestableIssues';

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

// *NOTE* in 995, it's called errorMessages - pending content refactoring
// *NOTE* in 996/10182, it's called issueErrorMessages
// Alert Veteran to duplicates based on name & decision date
export const addUniqueIssueErrorMessage = (
  errors,
  formData,
  appStateData,
  errorMssgs,
) => {
  if (errors?.addError && hasDuplicates(appStateData || formData)) {
    errors.addError(errorMssgs.uniqueIssue);
  }
};
