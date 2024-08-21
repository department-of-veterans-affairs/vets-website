import React from 'react';

import { pageTitle } from '../utils/helpers';

export default {
  uiSchema: {
    disabilityRating: {
      'ui:title': pageTitle(
        'Have you applied for and received a disability rating from VA?',
        'We’re asking because receivimg a service-connected disability rating from VA may make you eligible for additional benefits. Receiving these benefits won’t take away from other Veterans in need.',
      ),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          YES: { disabilityRating: 'Yes' },
          NO: { disabilityRating: 'No' },
        },
      },
    },
    'view:disabilityEligibility': {
      'ui:description': (
        <a
          href="https://www.va.gov/disability/eligibility"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about disability ratings.
        </a>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      disabilityRating: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
      'view:disabilityEligibility': {
        type: 'object',
        properties: {},
      },
    },
  },
};
