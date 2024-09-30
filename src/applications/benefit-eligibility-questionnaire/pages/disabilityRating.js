import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { disabilityTypes, disabilityTypeLabels } from '../constants/benefits';

export default {
  uiSchema: {
    disabilityRating: radioUI({
      title: 'Do you have a VA disability rating?',
      labels: disabilityTypeLabels,
      required: () => false,
    }),
    'view:disabilityEligibility': {
      'ui:description': (
        <div>
          <a
            href="https://www.va.gov/disability/eligibility"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about disability ratings.
          </a>{' '}
          <span> (opens in a new tab)</span>
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
