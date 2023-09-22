import React from 'react';

import { SECURITY_QUESTIONS } from '../definitions/constants';
import { camelCaseToSnakeAllCaps } from '../utils';

export default {
  uiSchema: {
    'ui:title': ({ formData }) => {
      return (
        <legend>
          <h3>
            {
              SECURITY_QUESTIONS[
                camelCaseToSnakeAllCaps(formData.securityQuestion)
              ]
            }{' '}
            <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
              (*Required)
            </span>
          </h3>
        </legend>
      );
    },
    securityAnswer: {
      'ui:title':
        'Enter the information your third-party source will need to provide to verify their identity.',
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
