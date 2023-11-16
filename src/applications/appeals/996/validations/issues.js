import { issueErrorMessages } from '../content/addIssue';

import { maxSelectedErrorMessage } from '../../shared/content/contestableIssues';
import { MAX_LENGTH } from '../../shared/constants';
import { getSelected } from '../../shared/utils/issues';

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
