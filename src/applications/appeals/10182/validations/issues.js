import { showExtensionReason } from '../utils/helpers';
import { issueErrorMessages } from '../content/addIssue';
import { content as extensionReasonContent } from '../content/extensionReason';

import { maxSelectedErrorMessage } from '../../shared/content/contestableIssues';
import { MAX_LENGTH, REGEXP } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

// TODO: refactor once issueErrorMessages and errorMessages are the same upon content review
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
  addUniqueIssueErrorMessage(
    errors,
    formData,
    appStateData,
    issueErrorMessages,
  );
};

export const maxIssues = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (getSelected(appStateData || formData).length > MAX_LENGTH.SELECTIONS) {
    errors.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (errors, data) => {
  if (!data) {
    errors.addError(issueErrorMessages.missingIssue);
  }
};

export const maxNameLength = (errors, data) => {
  if (data.length > MAX_LENGTH.NOD_ISSUE_NAME) {
    errors.addError(issueErrorMessages.maxLength);
  }
};

export const extensionReason = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  const data = appStateData || formData || {};
  // Ensure reason isn't just whitespace
  const reason = (data.extensionReason || '').replace(REGEXP.WHITESPACE, '');
  if (showExtensionReason(data) && !reason) {
    errors.addError(extensionReasonContent.errorMessage);
  }
};
