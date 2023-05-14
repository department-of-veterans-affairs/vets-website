import React from 'react';
import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousSahApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [previousSahApplicationFields.hasPreviousSahApplication];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Specially adapted housing grant applications
        </h3>
      ),
      [previousSahApplicationFields.hasPreviousSahApplication]: {
        'ui:title':
          'Have you applied for a specially adapted housing (SAH) grant before?',
        'ui:widget': 'yesNo',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousSahApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
