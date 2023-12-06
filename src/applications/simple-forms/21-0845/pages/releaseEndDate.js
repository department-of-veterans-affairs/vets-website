import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';

import { releaseEndDateValidation } from '../validations';

const labelString = 'When should we stop releasing your information?';

/** @type {PageSchema} */
export default {
  uiSchema: {
    releaseEndDate: {
      'ui:title': (
        <h3>
          {labelString}{' '}
          <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
            (*Required)
          </span>
        </h3>
      ),
      'ui:widget': 'date',
      'ui:reviewField': ({ children }) => (
        // prevent ui:title's <h3> from getting pulled into
        // review-field's <dt> & causing a11y headers-hierarchy errors.
        <div className="review-row">
          <dt>{labelString}</dt>
          <dd>{children}</dd>
        </div>
      ),
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
