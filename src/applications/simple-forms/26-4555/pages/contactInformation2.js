import { intersection, pick } from 'lodash';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  phoneUI,
  emailUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [
  veteranFields.homePhone,
  veteranFields.mobilePhone,
  veteranFields.email,
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      ...titleUI('Phone and email address'),
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
        properties: {
          ...pick(properties, pageFields),
          [veteranFields.homePhone]: phoneSchema,
          [veteranFields.mobilePhone]: phoneSchema,
        },
      },
    },
  },
};
