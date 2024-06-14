import { getSelected, hasDuplicates, hasSomeSelected } from '../utils/issues';
import { noneSelected } from '../content/contestableIssues';
import errorMessages from '../content/errorMessages';
import { MAX_LENGTH } from '../constants';

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
