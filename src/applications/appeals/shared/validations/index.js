import { SELECTED } from '../constants';

export const validateRequireRatedDisability = (
  errors = {},
  fieldData = [],
  errorMsgs = {},
) => {
  if (!fieldData.some(entry => entry[SELECTED])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    errors.addError?.(errorMsgs.contestedIssue);
  }
};

/**
 * Check validations for Custom pages
 * @param {Function[]} validations - array of validation functions
 * @param {*} data - field data passed to the validation function
 * @param {*} fullData - full and appStateData passed to validation function
 * @param {*} index - array index if within an array
 * @returns {String[]} - error messages
 */
export const checkValidations = (
  validations = [],
  data = {},
  fullData = {},
  index,
  appAbbr = null,
) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  /* errors, fieldData, formData, schema, uiSchema, index, appStateData */
  validations.map(validation =>
    validation(errors, data, fullData, null, null, index, fullData, appAbbr),
  );
  return errors.errorMessages;
};
