import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';

import { releaseEndDateValidation } from '../validations';

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
      'ui:validations': [releaseEndDateValidation],
      'ui:errorMessages': {
        required: 'Please provide an end date.',
        pattern: 'Please provide a valid end date.',
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
