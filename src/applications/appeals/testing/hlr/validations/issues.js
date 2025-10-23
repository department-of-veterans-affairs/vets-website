import errorMessages from '../../../shared/content/errorMessages';
import { MAX_LENGTH } from '../../../shared/constants';

export const maxNameLength = (error, data) => {
  if (data.length > MAX_LENGTH.ISSUE_NAME) {
    error.addError(errorMessages.maxLength(MAX_LENGTH.ISSUE_NAME));
  }
};
