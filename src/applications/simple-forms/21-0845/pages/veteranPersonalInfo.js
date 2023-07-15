import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { validateDateOfBirth } from 'platform/forms/validations';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: fullNameUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:description': (
        <p className="dob-description">For example: January 19 2000</p>
      ),
      'ui:widget': 'date',
      'ui:validations': [validateDateOfBirth],
      'ui:errorMessages': {
        pattern: 'Please provide a valid date of birth',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: schema(),
      veteranDateOfBirth: definitions.date,
    },
  },
};
