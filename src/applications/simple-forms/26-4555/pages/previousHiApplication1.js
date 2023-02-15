import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousHiApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [previousHiApplicationFields.hasPreviousHiApplication];
const previousHiApplication1 = {
  uiSchema: {
    [previousHiApplicationFields.hasPreviousHiApplication]: {
      'ui:title':
        'Have you previously applied for a home improvement or structural alteration grant?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default previousHiApplication1;
