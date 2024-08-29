import React from 'react';

import { AUTHORIZER_TYPE_ITEMS } from '../definitions/constants';
import { getEnumsFromConstants, getLabelsFromConstants } from '../utils';

const labelString = 'Who is submitting this authorization?';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerType: {
      'ui:title': (
        <>
          <h2 className="vads-u-font-size--h3">{labelString}</h2>
          Select the description that fits you.
        </>
      ),
      'ui:widget': 'radio',
      'ui:reviewField': ({ children }) => (
        // prevent ui:title's <h2> from getting pulled into
        // review-field's <dt> & causing a11y headers-hierarchy errors.
        <div className="review-row">
          <dt>{labelString}</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:options': {
        labels: getLabelsFromConstants(AUTHORIZER_TYPE_ITEMS),
      },
    },
    'view:note': {
      'ui:description': () => (
        <p>
          <strong>Note: </strong>
          You can authorize the release of only your own information with this
          online form. If you’re a court-ordered or VA-appointed fiduciary
          representing a beneficiary, you’ll need to{' '}
          <a
            href="http://www.vba.va.gov/pubs/forms/VBA-21-0845-ARE.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            download the PDF version of this form
            <va-icon icon="launch" srtext="opens in a new window" />
          </a>
          . Then submit it in person or by mail.
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
