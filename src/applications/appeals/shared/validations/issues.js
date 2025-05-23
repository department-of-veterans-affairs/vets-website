import { getSelected, hasDuplicates, hasSomeSelected } from '../utils/issues';
import { NONE_SELECTED_ERROR, MAX_LENGTH } from '../constants';
import errorMessages from '../content/errorMessages';

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
    errors.addError(NONE_SELECTED_ERROR);
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

export const missingIssueName = (errors, data) => {
  if (!data) {
    errors.addError(errorMessages.missingIssue);
  }
};

export const maxIssues = (error, data) => {
  if (getSelected(data).length > MAX_LENGTH.SELECTIONS) {
    error.addError(errorMessages.maxSelected);
  }
};
