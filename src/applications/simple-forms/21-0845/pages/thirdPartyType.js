import React from 'react';

import { THIRD_PARTY_TYPES } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyType: {
      'ui:title': (
        <h3 className="custom-header">
          Do you authorize us to release your information to a specific person
          or to an organization?
        </h3>
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
