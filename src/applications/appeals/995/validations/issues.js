import { errorMessages } from '../constants';
import { validateDate } from './date';

import { maxSelectedErrorMessage } from '../../shared/content/contestableIssues';
import { MAX_LENGTH } from '../../shared/constants';
import {
  getIssueDate,
  getIssueName,
  getSelected,
} from '../../shared/utils/issues';
import { addUniqueIssueErrorMessage } from '../../shared/validations/issues';

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
  addUniqueIssueErrorMessage(errors, formData, appStateData, errorMessages);
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
