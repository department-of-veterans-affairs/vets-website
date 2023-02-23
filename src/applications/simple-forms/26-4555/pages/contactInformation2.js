import { intersection, pick } from 'lodash';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [
  veteranFields.homePhone,
  veteranFields.mobilePhone,
  veteranFields.email,
];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      'ui:title': 'Additional contact information',
      'ui:description':
        'Please enter your contact information so we can get in touch with you if we have questions about your application.',
      [veteranFields.homePhone]: phoneUI('Home phone number'),
      [veteranFields.mobilePhone]: phoneUI('Mobile phone number'),
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
