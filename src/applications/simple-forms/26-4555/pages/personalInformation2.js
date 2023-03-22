import React from 'react';
import { intersection, pick } from 'lodash';

import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.ssn, veteranFields.vaFileNumber];

export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
        Identification information
      </h3>
    ),
    [veteranFields.parentObject]: {
      [veteranFields.ssn]: ssnUI,
      [veteranFields.vaFileNumber]: {
        'ui:title': 'VA file number (if you have one)',
        'ui:errorMessages': {
          pattern:
            'Please input a valid VA file number: 7 to 9 numeric digits, & may start with a letter "C" or "c".',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
