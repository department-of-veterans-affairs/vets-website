import { showExtensionReason } from '../utils/helpers';
import { content as extensionReasonContent } from '../content/extensionReason';

import { MAX_LENGTH, REGEXP } from '../../shared/constants';
import errorMessages from '../../shared/content/errorMessages';

export const maxNameLength = (errors, data) => {
  if (data.length > MAX_LENGTH.NOD_ISSUE_NAME) {
    errors.addError(errorMessages.maxLength(MAX_LENGTH.NOD_ISSUE_NAME));
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
