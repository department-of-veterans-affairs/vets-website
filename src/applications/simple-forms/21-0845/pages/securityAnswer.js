import React from 'react';

import { SECURITY_QUESTIONS } from '../definitions/constants';
import { camelCaseToSnakeAllCaps } from '../utils';

export default {
  uiSchema: {
    'ui:title': ({ formData }) => {
      return (
        <legend>
          <h3 className="custom-header">
            {
              SECURITY_QUESTIONS[
                camelCaseToSnakeAllCaps(formData.securityQuestion)
              ]
            }{' '}
            <span className="custom-required-span">(*Required)</span>
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
