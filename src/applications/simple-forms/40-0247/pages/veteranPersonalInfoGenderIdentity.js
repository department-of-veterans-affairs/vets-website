import React from 'react';

import { GENDER_IDENTITIES } from '../definitions/constants';
import { lowercaseKeys } from '../form-helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3>Select the Veteran's gender identity</h3>,
    'ui:description': 'Information is gathered for statistical purposes only.',
    veteranGenderIdentity: {
      'ui:title': 'Gender identity',
      'ui:widget': 'radio',
      'ui:options': {
        labels: lowercaseKeys(GENDER_IDENTITIES),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranGenderIdentity: {
        type: 'string',
        enum: Object.keys(GENDER_IDENTITIES).map(key => key.toLowerCase()),
      },
    },
  },
};
