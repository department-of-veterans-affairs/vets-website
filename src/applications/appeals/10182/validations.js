import { hasSomeSelected } from './utils/helpers';
import { optInErrorMessage } from './content/OptIn';
import { missingIssuesErrorMessage } from './content/additionalIssues';

export const requireIssue = (
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
  if (!hasSomeSelected(data)) {
    errors.addError(missingIssuesErrorMessage);
  }
};

export const optInValidation = (errors, value) => {
  if (!value) {
    errors.addError(optInErrorMessage);
  }
};
