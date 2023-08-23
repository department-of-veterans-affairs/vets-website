import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

import {
  content,
  ExtensionReasonReviewField,
} from '../content/extensionReason';
import { extensionReason } from '../validations/issues';
import { showExtensionReason } from '../utils/helpers';
import { NOD_MAX_LENGTH } from '../constants';

const requestExtension = {
  uiSchema: {
    'ui:title': content.title,
    'ui:description': content.description,
    extensionReason: {
      'ui:title': content.label,
      'ui:reviewField': ExtensionReasonReviewField,
      'ui:webComponentField': VaTextareaField,
      'ui:required': showExtensionReason,
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
      extensionReason: {
        type: 'string',
        maxLength: NOD_MAX_LENGTH.EXTENSION_REASON,
      },
    },
  },
};

export default requestExtension;
