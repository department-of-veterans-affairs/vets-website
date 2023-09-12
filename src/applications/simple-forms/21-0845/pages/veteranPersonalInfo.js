import React from 'react';

import { cloneDeep } from 'lodash';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { validateDateOfBirth } from 'platform/forms/validations';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

const veteranFullNameUI = cloneDeep(fullNameUI);
const dobLabelString = 'Date of birth';

veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: veteranFullNameUI,
    veteranDateOfBirth: {
      'ui:title': (
        <div className="vads-u-font-weight--normal vads-u-font-size--base vads-u-margin-bottom--2">
          <span>
            {dobLabelString}{' '}
            <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
              (*Required)
            </span>
          </span>
          <br />
          <span className="vads-u-color--gray-medium">
            For example: January 19 2000
          </span>
        </div>
      ),
      'ui:widget': 'date',
      'ui:reviewField': ({ children }) => (
        // remove custom required-span & hint-text from review-field's <dt>
        <div className="review-row">
          <dt>{dobLabelString}</dt>
          <dd>{children}</dd>
        </div>
      ),
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
