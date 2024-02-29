import React from 'react';
import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousHiApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [previousHiApplicationFields.hasPreviousHiApplication];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousHiApplicationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Special home adaptation grant applications
        </h3>
      ),
      [previousHiApplicationFields.hasPreviousHiApplication]: {
        'ui:title':
          'Have you applied for a special home adaptation (SHA) grant before?',
        'ui:widget': 'yesNo',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousHiApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
