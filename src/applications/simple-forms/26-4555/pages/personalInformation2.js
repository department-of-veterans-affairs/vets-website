import React from 'react';
import { intersection, pick } from 'lodash';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.ssn, veteranFields.vaFileNumber];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Identification information
        </h3>
      ),
      [veteranFields.ssn]: ssnUI,
      [veteranFields.vaFileNumber]: {
        'ui:title': 'VA file number (if you have one)',
        'ui:errorMessages': {
          pattern: 'Your VA file number must be 8 or 9 digits',
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
