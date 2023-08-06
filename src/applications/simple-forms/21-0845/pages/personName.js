import React from 'react';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="custom-header">
        Tell us who we can release your information to.
      </h3>
    ),
    personFullName: fullNameUI,
  },
  schema: {
    type: 'object',
    required: ['personFullName'],
    properties: {
      personFullName: schema({
        pdfMaxLengths: { first: 12, middle: 18, last: 18 },
      }),
    },
  },
};
