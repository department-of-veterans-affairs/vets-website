import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Additional Information
      </h3>
    ),
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
