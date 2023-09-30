import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    benefitSelection: {
      ...radioUI({
        labels: ['Survivors'],
        labelHeaderLevel: '3',
      }),
      'ui:errorMessages': {
        required: 'Select the benefit listed',
      },
    },
    additionalInfo: {
      'ui:title': '',
      'ui:widget': VaAdditionalInfo,
      'ui:description': (
        <va-additional-info trigger="What's an intent to file?">
          An intent to file request lets us know that you’re planning to file a
          claim. An intent to file reserves a potential effective date for when
          you could start getting benefits while you prepare your claim and
          gather supporting documents.
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelection: radioSchema(['Survivors']),
      additionalInfo: {
        type: 'object',
        properties: {},
      },
    },
    required: ['benefitSelection'],
  },
};
