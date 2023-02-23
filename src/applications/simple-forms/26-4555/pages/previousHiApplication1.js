import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousHiApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [previousHiApplicationFields.hasPreviousHiApplication];

export default {
  uiSchema: {
    [previousHiApplicationFields.parentObject]: {
      [previousHiApplicationFields.hasPreviousHiApplication]: {
        'ui:title':
          'Have you previously applied for a special home adaptation (SHA) grant?',
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
