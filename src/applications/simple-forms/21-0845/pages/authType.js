import React from 'react';

import { AUTHORIZER_TYPES } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerType: {
      'ui:title': (
        <span
          className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold"
          role="heading"
          aria-level={2}
        >
          Who is submitting this authorization?
        </span>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          [AUTHORIZER_TYPES.VETERAN]:
            'I’m a Veteran authorizing the VA submitting on my own behalf',
          [AUTHORIZER_TYPES.NON_VETERAN]:
            'I’m a non-Veteran beneficiary or claimant submitting on behalf of a Veteran',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['authorizerType'],
    properties: {
      authorizerType: {
        type: 'string',
        enum: [AUTHORIZER_TYPES.VETERAN, AUTHORIZER_TYPES.NON_VETERAN],
      },
    },
  },
};
