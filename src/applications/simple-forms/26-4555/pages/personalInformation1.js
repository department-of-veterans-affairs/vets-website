import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.fullName]: fullNameUI,
      [veteranFields.dateOfBirth]: {
        'ui:title': 'Date of birth',
        'ui:widget': 'date',
        'ui:errorMessages': {
          pattern: 'Please select Month, Day, and input a 4-digit Year.',
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
