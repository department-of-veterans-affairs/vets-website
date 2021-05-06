import { hasSomeSelected } from './utils/helpers';
import { optInErrorMessage } from './content/OptIn';
import { missingIssuesErrorMessage } from './content/additionalIssues';

// not used to show an issue on the eligible issues page, but needed when the
// user submits and we want to show where the error is
export const requireIssue = (
  errors,
  _fieldData,
  _formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (!hasSomeSelected(appStateData)) {
    errors.addError(missingIssuesErrorMessage);
  }
};

export const optInValidation = (errors, value) => {
  if (!value) {
    errors.addError(optInErrorMessage);
  }
};
