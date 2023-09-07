import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    organizationName: {
      'ui:title': <h3 className="custom-header">Organization’s name</h3>,
    },
  },
  schema: {
    type: 'object',
    required: ['organizationName'],
    properties: {
      organizationName: {
        type: 'string',
      },
    },
  },
};
