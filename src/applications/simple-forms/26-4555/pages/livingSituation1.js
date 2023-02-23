import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [livingSituationFields.isInCareFacility];

export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      [livingSituationFields.isInCareFacility]: {
        'ui:title':
          'Are you currently living in a nursing home or medical care facility?',
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
