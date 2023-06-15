import React from 'react';

import { THIRD_PARTY_TYPES } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyType: {
      'ui:title': (
        <span
          className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold"
          role="heading"
          aria-level={3}
        >
          Do you authorize us to release your information to a specific person
          or to an organization?
        </span>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          [THIRD_PARTY_TYPES.PERSON]: 'A specific person',
          [THIRD_PARTY_TYPES.ORGANIZATION]: 'An organization',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['thirdPartyType'],
    properties: {
      thirdPartyType: {
        type: 'string',
        enum: Object.values(THIRD_PARTY_TYPES),
      },
    },
  },
};
