import React from 'react';

import { AUTHORIZER_TYPE_ITEMS } from '../definitions/constants';
import { getEnumsFromConstants, getLabelsFromConstants } from '../utils';

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
      'ui:description': 'Select the description that fits you.',
      'ui:widget': 'radio',
      'ui:options': {
        labels: getLabelsFromConstants(AUTHORIZER_TYPE_ITEMS),
      },
    },
    'view:note': {
      'ui:description': () => (
        <p>
          <strong>Note: </strong>
          You can authorize the release of only your own information with this
          online form. If you're a court-ordered or VA-appointed fiduciary
          representing a beneficiary, you'll need to download the PDF version of
          this form. Then submit it in person or by mail.
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['authorizerType'],
    properties: {
      authorizerType: {
        type: 'string',
        enum: getEnumsFromConstants(AUTHORIZER_TYPE_ITEMS),
      },
      'view:note': {
        type: 'object',
        properties: {},
      },
    },
  },
};
