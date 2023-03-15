import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import { intersection, pick } from 'lodash';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Name and date of birth
        </h3>
      ),
      [veteranFields.fullName]: fullNameUI,
      [veteranFields.dateOfBirth]: dateUI('Date of birth'),
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
