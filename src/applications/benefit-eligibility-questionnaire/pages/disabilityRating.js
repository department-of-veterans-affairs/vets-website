import React from 'react';

import { pageTitle } from '../utils/helpers';

export default {
  uiSchema: {
    disabilityRating: {
      'ui:title': pageTitle('Do you have a VA disability rating?'),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          appliedAndReceived: {
            disabilityRating: "I've applied and received a disability rating",
          },
          submitted: {
            disabilityRating:
              "I've submitted but haven't received a rating yet",
          },
          started: {
            disabilityRating:
              "I've started the process but haven't submitted yet",
          },
          notApplied: {
            disabilityRating: "I haven't applied for a disability rating",
          },
        },
      },
    },
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
      disabilityRating: {
        type: 'string',
        enum: [
          "I've applied and received a disability rating",
          "I've submitted but haven't received a rating yet",
          "I've started the process but haven't submitted yet",
          "I haven't applied for a disability rating",
        ],
      },
      'view:disabilityEligibility': {
        type: 'object',
        properties: {},
      },
    },
  },
};
