import React from 'react';

import { THIRD_PARTY_TYPES } from '../definitions/constants';

const labelString =
  'Do you authorize us to release your information to a specific person or to an organization?';

/** @type {PageSchema} */
export default {
  uiSchema: {
    thirdPartyType: {
      'ui:title': <h3 style={{ display: 'inline' }}>{labelString}</h3>,
      'ui:widget': 'radio',
      'ui:reviewField': ({ children }) => (
        // prevent ui:title's <h3> from getting pulled into
        // review-field's <dt> & causing a11y headers-hierarchy errors.
        <div className="review-row">
          <dt>{labelString}</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:errorMessages': {
        required:
          'Please select who you would like us to release information to',
      },
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
