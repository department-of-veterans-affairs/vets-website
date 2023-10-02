import React from 'react';

import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern.jsx';
import {
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import { textInputNumericRange } from '../helpers';

export default {
  uiSchema: {
    ...titleUI(
      'Where should we send your additional certificates?',
      <span className="custom-label h4">Additional address</span>,
    ),
    additionalAddress: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
    'view:title2': {
      'ui:title': (
        <h4 className="vads-u-margin-y--0">Number of certificates</h4>
      ),
    },
    additionalCopies: {
      'ui:title': 'How many certificates should we send to this address?',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'You may request up to 99 certificates',
        inputmode: 'numeric',
      },
      'ui:errorMessages': {
        required:
          'Please provide the number of certificates you’d like to request',
        pattern:
          'Please enter a valid number of certificates, between 1 and 99',
      },
    },
    'ui:validations': [
      (errors, formData) => {
        return textInputNumericRange(errors, formData, {
          schemaKey: 'additionalCopies',
          range: { min: 1, max: 99 },
          customErrorMessages: {
            min:
              'Please raise the number of certificates, you may request up to 99',
            max:
              'Please lower the number of certificates, you may request up to 99',
          },
        });
      },
    ],
  },
  schema: {
    type: 'object',
    properties: {
      'view:title1': titleSchema,
      additionalAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
      'view:title2': titleSchema,
      additionalCopies: {
        type: 'string',
        pattern: '^\\d*$',
      },
    },
    required: ['additionalAddress', 'additionalCopies'],
  },
};
