import { someSelected } from './utils/helpers';
import { optInErrorMessage } from './content/OptIn';
import { missingIssuesErrorMessage } from './content/contestableIssues';

// not used to show an issue on the eligible issues page, but needed when the
// user submits and we want to show where the error is
export const requireIssue = (
  errors,
  _fieldData,
  _formData,
  _schema,
  _uiSchema,
  _index,
  { contestableIssues = [], additionalIssues = [] },
) => {
  if (!(someSelected(contestableIssues) || someSelected(additionalIssues))) {
    errors.addError(missingIssuesErrorMessage);
  }
};

export const optInValidation = (errors, value) => {
  if (!value) {
    errors.addError(optInErrorMessage);
  }
};
