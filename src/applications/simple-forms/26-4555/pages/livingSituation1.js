import React from 'react';
import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [livingSituationFields.isInCareFacility];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Current arrangement
        </h3>
      ),
      [livingSituationFields.isInCareFacility]: {
        'ui:title': 'Do you live in a nursing home or medical care facility?',
        'ui:widget': 'yesNo',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [livingSituationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
