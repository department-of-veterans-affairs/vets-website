import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousSahApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [previousSahApplicationFields.hasPreviousSahApplication];

export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      [previousSahApplicationFields.hasPreviousSahApplication]: {
        'ui:title':
          'Have you previously applied for specially adapted housing (SAH) grant?',
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
