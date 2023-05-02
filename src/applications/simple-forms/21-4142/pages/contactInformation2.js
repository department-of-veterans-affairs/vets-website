import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [
  veteranFields.homePhone,
  veteranFields.internationalPhone,
  veteranFields.email,
];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.homePhone]: phoneUI('Home phone number'),
      [veteranFields.internationalPhone]: phoneUI('International phone number'),
      [veteranFields.email]: emailUI(),
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
