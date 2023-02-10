import { intersection, pick } from 'lodash';

import { livingSituationFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [livingSituationFields.isInCareFacility];

const livingSituation1 = {
  uiSchema: {
    [livingSituationFields.isInCareFacility]: {
      'ui:title':
        'Are you currently living in a nursing home or medical care facility?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default livingSituation1;
