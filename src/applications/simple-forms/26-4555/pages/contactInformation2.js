import { intersection, pick } from 'lodash';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { veteranFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [
  veteranFields.homePhone,
  veteranFields.mobilePhone,
  veteranFields.email,
];
const contactInformation2 = {
  uiSchema: {
    [veteranFields.homePhone]: phoneUI('Home phone number'),
    [veteranFields.mobilePhone]: phoneUI('Cell phone number'),
    [veteranFields.email]: {
      'ui:title': 'Email address',
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default contactInformation2;
