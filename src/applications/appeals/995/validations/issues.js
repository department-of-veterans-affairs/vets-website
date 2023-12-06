import { errorMessages } from '../constants';
import { validateDate } from './date';

import { MAX_LENGTH } from '../../shared/constants';
import {
  getIssueDate,
  getIssueName,
  getSelected,
} from '../../shared/utils/issues';
import { missingIssueName } from '../../shared/validations/issues';

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
