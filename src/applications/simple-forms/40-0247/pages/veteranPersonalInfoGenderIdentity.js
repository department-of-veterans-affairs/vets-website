import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3>Select the Veteran's gender identity</h3>,
    'ui:description': 'Information is gathered for statistical purposes only.',
    veteranGenderIdentity: {
      'ui:title': 'Gender identity',
      'ui:widget': 'radio',
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranGenderIdentity: {
        type: 'string',
        enum: [
          'Man',
          'Non-binary',
          'Transgender man',
          'Transgender woman',
          'Woman',
          'Prefer not to answer',
          'A gender not listed here',
        ],
      },
    },
  },
};
