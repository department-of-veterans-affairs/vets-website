import React from 'react';

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AUTHORIZER_TYPE_ITEMS } from '../definitions/constants';
import { getEnumsFromConstants, getLabelsFromConstants } from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerType: radioUI({
      title: 'Who is submitting this authorization?',
      description: 'Select the description that fits you.',
      labels: getLabelsFromConstants(AUTHORIZER_TYPE_ITEMS),
      errorMessages: {
        required: 'You must provide a response',
      },
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
    }),
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
      authorizerType: radioSchema(getEnumsFromConstants(AUTHORIZER_TYPE_ITEMS)),
      'view:note': {
        type: 'object',
        properties: {},
      },
    },
  },
};
