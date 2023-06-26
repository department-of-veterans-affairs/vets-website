import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    organizationName: {
      'ui:title': (
        <span className="vads-u-font-family--serif vads-u-font-size--h4 vads-u-font-weight--bold">
          Organization’s name
        </span>
      ),
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
