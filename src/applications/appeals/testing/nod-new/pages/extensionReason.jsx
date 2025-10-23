import React from 'react';

import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

import { content } from '../content/extensionReason';
import { showExtensionReason } from '../../../10182/utils/helpers';
import { MAX_LENGTH } from '../../../shared/constants';

const requestExtension = {
  uiSchema: {
    'ui:title': content.title,
    extensionReason: {
      'ui:title': content.label,
      'ui:webComponentField': VaTextareaField,
      'ui:required': showExtensionReason,
      'ui:options': {
        enableAnalytics: false,
        hint: content.hint,
      },
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
        maxLength: MAX_LENGTH.NOD_EXTENSION_REASON,
      },
    },
  },

  review: data => ({
    'Reason for extension': data.extensionReason ? (
      <span>Added reason for extension</span>
    ) : (
      <span className="usa-input-error-message">
        Missing reason for extension
      </span>
    ),
  }),
};

export default requestExtension;
