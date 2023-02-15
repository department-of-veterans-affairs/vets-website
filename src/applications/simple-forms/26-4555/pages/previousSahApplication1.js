import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousSahApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [previousSahApplicationFields.hasPreviousSahApplication];
const previousSahApplication1 = {
  uiSchema: {
    [previousSahApplicationFields.hasPreviousSahApplication]: {
      'ui:title':
        'Have you previously applied for specially adapted housing or special home adaptation grant?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default previousSahApplication1;
