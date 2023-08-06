import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    releaseEndDate: {
      'ui:title': (
        <h3 className="custom-header">
          When should we stop releasing your information?{' '}
          <span className="custom-required-span">(*Required)</span>
        </h3>
      ),
      'ui:widget': 'date',
      'ui:errorMessages': {
        required: 'Please provide an end date.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['releaseEndDate'],
    properties: {
      releaseEndDate: definitions.date,
    },
  },
};
