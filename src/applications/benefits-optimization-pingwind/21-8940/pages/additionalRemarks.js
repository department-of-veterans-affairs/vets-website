import React from 'react';

const additionalRemarksDescription = <h3>Additional information</h3>;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Additional Information',
    'ui:description': 'Anything else we should know?',
    additionalRemarks: {
      'ui:title':
        'Enter additional information you may want to share (optional)',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 1000,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalRemarks: {
        type: 'string',
        properties: {},
      },
    },
  },
};
