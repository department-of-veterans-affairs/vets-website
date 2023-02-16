import { intersection, pick } from 'lodash';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
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
const contactInformation2 = {
  uiSchema: {
    'ui:title': 'Additional contact information',
    'ui:description':
      'Please enter your contact information so we can get in touch with you if we have questions about your application.',
    [veteranFields.homePhone]: phoneUI('Home phone number'),
    [veteranFields.mobilePhone]: phoneUI('Mobile phone number'),
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
