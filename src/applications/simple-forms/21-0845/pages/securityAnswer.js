import React from 'react';

import { SECURITY_QUESTIONS } from '../definitions/constants';
import { camelCaseToSnakeAllCaps } from '../utils';

export default {
  uiSchema: {
    'ui:title': ({ formData }) => {
      return (
        <legend id="root_securityAnswer-label" className="schemaform-label">
          <span className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
            {
              SECURITY_QUESTIONS[
                camelCaseToSnakeAllCaps(formData.securityQuestion)
              ]
            }
          </span>
        </legend>
      );
    },
    'ui:description':
      'Enter the information your third-party source will need to provide to verify their identity.',
    securityAnswer: {
      'ui:title': 'Your answer',
      'ui:errorMessages': {
        required: 'Please enter your answer.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['securityAnswer'],
    properties: {
      securityAnswer: {
        type: 'string',
      },
    },
  },
};
