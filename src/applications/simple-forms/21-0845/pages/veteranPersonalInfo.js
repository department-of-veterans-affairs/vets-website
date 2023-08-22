import React from 'react';

import { cloneDeep } from 'lodash';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { validateDateOfBirth } from 'platform/forms/validations';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

const veteranFullNameUI = cloneDeep(fullNameUI);

veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: veteranFullNameUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:description': (
        <p className="custom-description hint-text">
          For example: January 19 2000
        </p>
      ),
      'ui:widget': 'date',
      'ui:validations': [validateDateOfBirth],
      'ui:errorMessages': {
        required: 'Please provide a date of birth',
        pattern: 'Please provide a valid date of birth',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: schema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
      veteranDateOfBirth: definitions.date,
    },
  },
};
