import React from 'react';

import { CLAIM_OWNERSHIP } from '../definitions/constants';

export default {
  uiSchema: {
    claimOwnership: {
      'ui:title': (
        <span className="vads-u-font-family--serif vads-u-font-size--h3">
          Are you submitting this statement to support your claim or someone
          else’s claim?
        </span>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          self: 'My own claim',
          'third-party': 'Someone else’s claim',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimOwnership'],
    properties: {
      claimOwnership: {
        type: 'string',
        enum: [CLAIM_OWNERSHIP.SELF, CLAIM_OWNERSHIP.THIRD_PARTY],
      },
    },
  },
};
