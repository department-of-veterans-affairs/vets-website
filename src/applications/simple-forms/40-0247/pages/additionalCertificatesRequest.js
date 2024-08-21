import React from 'react';

import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import {
  numberUI,
  numberSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import environment from 'platform/utilities/environment';

export default {
  uiSchema: {
    ...titleUI(
      'Where should we send your additional certificates?',
      environment.isProduction() ? (
        <span className="custom-label h4">Additional address</span>
      ) : (
        <h4 className="custom-label h4">Additional address</h4>
      ),
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
    additionalCopies: numberUI({
      title: 'How many certificates should we send to this address?',
      hint: 'You may request up to 99 certificates',
      errorMessages: {
        required: 'Enter the number of certificates you’d like to request',
        pattern: 'Enter a valid number between 1 and 99',
      },
      min: 1,
      max: 99,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title1': titleSchema,
      additionalAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
      'view:title2': titleSchema,
      additionalCopies: numberSchema,
    },
    required: ['additionalAddress', 'additionalCopies'],
  },
};
