import React from 'react';

import { AUTHORIZER_TYPES, SECURITY_QUESTIONS } from '../definitions/constants';
import { camelCaseToSnakeAllCaps } from '../utils';

export default {
  uiSchema: {
    'ui:title': ({ formData }) => {
      if (formData.authorizerType === AUTHORIZER_TYPES.VETERAN) {
        return (
          <span className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
            {
              SECURITY_QUESTIONS[
                camelCaseToSnakeAllCaps(formData.securityQuestion)
              ]
            }
          </span>
        );
      }

      return (
        <span className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
          Provide your answer for:
          <br />“
          {
            SECURITY_QUESTIONS[
              camelCaseToSnakeAllCaps(formData.securityQuestion)
            ]
          }
          ”
        </span>
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
