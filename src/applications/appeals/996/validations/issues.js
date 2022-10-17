import { areaOfDisagreementWorkAround } from '../utils/ui';
import { getSelected, hasSomeSelected, hasDuplicates } from '../utils/helpers';
import { issueErrorMessages } from '../content/addIssue';
import {
  noneSelected,
  maxSelectedErrorMessage,
} from '../content/contestableIssues';
import { missingAreaOfDisagreementErrorMessage } from '../content/areaOfDisagreement';
import { MAX_LENGTH } from '../constants';

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
    errors.addError(issueErrorMessages.uniqueIssue);
  }
};

export const maxIssues = (error, data) => {
  if (getSelected(data).length > MAX_LENGTH.SELECTIONS) {
    error.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (error, data) => {
  if (!data) {
    error.addError(issueErrorMessages.missingIssue);
  }
};

export const maxNameLength = (error, data) => {
  if (data.length > MAX_LENGTH.ISSUE_NAME) {
    error.addError(issueErrorMessages.maxLength);
  }
};

export const areaOfDisagreementRequired = (
  errors,
  // added index to get around arrayIndex being null
  { disagreementOptions, otherEntry, index } = {},
  formData,
  _schema,
  _uiSchema,
  arrayIndex, // always null?!
) => {
  const keys = Object.keys(disagreementOptions || {});
  const hasChoice = keys.some(key => disagreementOptions[key]) || otherEntry;

  if (!hasChoice) {
    errors.addError(missingAreaOfDisagreementErrorMessage);
  }

  // work-around for error message not showing :(
  areaOfDisagreementWorkAround(hasChoice, arrayIndex || index);
};
