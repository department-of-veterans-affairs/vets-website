import {
  getSelected,
  hasSomeSelected,
  hasDuplicates,
  getIssueName,
  getIssueDate,
} from '../utils/helpers';
import {
  noneSelected,
  maxSelectedErrorMessage,
} from '../../shared/content/contestableIssues';
import { errorMessages } from '../constants';
import { validateDate } from './date';

import { MAX_LENGTH } from '../../shared/constants';

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

export const maxIssues = (errors, data) => {
  if (getSelected(data).length > MAX_LENGTH.SELECTIONS) {
    errors.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (errors, data) => {
  if (!data) {
    errors.addError(errorMessages.missingIssue);
  }
};

export const maxNameLength = (errors, data) => {
  if (data.length > MAX_LENGTH.ISSUE_NAME) {
    errors.addError(errorMessages.maxLength);
  }
};

export const checkIssues = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;
  // Only use selected in case an API loaded issues includes an invalid date
  getSelected(data).forEach(issue => {
    missingIssueName(errors, getIssueName(issue));
    validateDate(errors, getIssueDate(issue));
  });
};
