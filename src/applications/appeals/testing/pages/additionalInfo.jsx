import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

import { content } from '../content/additionalInfo';
import { extensionReason } from '../../10182/validations/issues';

import { MAX_LENGTH } from '../../10182/constants';

const additionalInfo = {
  uiSchema: {
    'ui:title': content.title,
    additionalInfo: {
      'ui:title': content.label,
      'ui:webComponentField': VaTextareaField,
      'ui:required': formData => formData['view:additionalInfo'],
      'ui:options': {
        enableAnalytics: false,
        hint: content.hint,
      },
      'ui:validations': [extensionReason],
      'ui:errorMessages': {
        required: content.errorMessage,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      additionalInfo: {
        type: 'string',
        maxLength: MAX_LENGTH.EXTENSION_REASON,
      },
    },
  },

  review: data => ({
    'Do you want to write or upload additional information about your disagreements?': data[
      'view:additionalInfo'
    ]
      ? 'Yes'
      : 'No',
  }),
};

export default additionalInfo;
