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
      'ui:title': (
        <div className="vads-u-font-weight--normal vads-u-font-size--base vads-u-margin-bottom--2">
          <span>
            Date of birth{' '}
            <span className="custom-required-span hide-on-review-page">
              (*Required)
            </span>
          </span>
          <br />
          <span className="vads-u-color--gray-medium hide-on-review-page">
            For example: January 19 2000
          </span>
        </div>
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
