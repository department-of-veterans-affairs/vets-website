import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

import {
  content,
  extensionReasonReviewField,
} from '../content/extensionReason';
import { extensionReason } from '../validations/issues';
import { showExtensionReason } from '../utils/helpers';
import { MAX_LENGTH } from '../../shared/constants';

const requestExtension = {
  uiSchema: {
    'ui:title': content.title,
    'ui:description': content.description,
    extensionReason: {
      'ui:title': content.label,
      'ui:reviewField': extensionReasonReviewField,
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
        maxLength: MAX_LENGTH.EXTENSION_REASON,
      },
    },
  },
};

export default requestExtension;
