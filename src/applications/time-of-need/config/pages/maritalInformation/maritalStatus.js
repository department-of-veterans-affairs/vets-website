import React from 'react';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Marital status'),
    isSpouseOfDeceased: {
      ...radioUI({
        title: 'Are you the deceased Veteran’s spouse?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        errorMessages: {
          required: 'Select Yes or No',
        },
      }),
      'ui:options': {
        useV3: true,
      },
    },
    'view:whyWeAsk': {
      'ui:description': (
        <va-additional-info
          trigger="Why we ask for this information"
          open
          uswds
        >
          <p>
            We understand that these questions may be difficult to answer, but
            your answers will help us determine eligibility for your
            application.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['isSpouseOfDeceased'],
    properties: {
      isSpouseOfDeceased: {
        type: 'string',
        enum: ['yes', 'no'],
        enumNames: ['Yes', 'No'],
      },
      'view:whyWeAsk': {
        type: 'object',
        properties: {},
      },
    },
  },
};
