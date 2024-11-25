import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { disabilityTypes, disabilityTypeLabels } from '../constants/benefits';

export default {
  uiSchema: {
    disabilityRating: radioUI({
      enableAnalytics: true,
      title: 'Do you have a VA disability rating?',
      labels: disabilityTypeLabels,
      required: () => false,
    }),
    'view:disabilityEligibility': {
      'ui:description': (
        <div>
          <va-link
            href="https://www.va.gov/disability/eligibility"
            external
            text="Learn more about disability ratings"
            type="secondary"
            label="Learn more about disability ratings"
          />{' '}
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabilityRating: radioSchema(Object.keys(disabilityTypes)),
      'view:disabilityEligibility': {
        type: 'object',
        properties: {},
      },
    },
  },
};
