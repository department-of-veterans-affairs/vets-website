import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    releaseEndDate: {
      'ui:title': (
        <span className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
          When should we stop releasing your information?
        </span>
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
