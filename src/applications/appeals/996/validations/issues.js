import { issueErrorMessages } from '../content/addIssue';
import { MAX_LENGTH } from '../../shared/constants';

export const maxNameLength = (error, data) => {
  if (data.length > MAX_LENGTH.ISSUE_NAME) {
    error.addError(issueErrorMessages.maxLength);
  }
};
