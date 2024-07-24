import React from 'react';

export default {
  uiSchema: {
    disabilityRating: {
      'ui:title': (
        <>
          <p>
            <b>
              Have you applied for and received a disability rating from VA?
            </b>
          </p>
          <p>
            We’re asking because receivimg a service-connected disability rating
            from VA may make you eligible for additional benefits. Receiving
            these benefits won’t take away from other Veterans in need.
          </p>
        </>
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
