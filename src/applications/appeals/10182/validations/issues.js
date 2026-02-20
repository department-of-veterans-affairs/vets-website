import { showExtensionReason } from '../utils/helpers';
import { content as extensionReasonContent } from '../content/extensionReason';
import { REGEXP } from '../../shared/constants';

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
