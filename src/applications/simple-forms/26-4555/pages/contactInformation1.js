import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.address];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      ...titleUI(
        'Mailing address',
        'We’ll send any important information about your application to this address.',
      ),
      [veteranFields.address]: addressUI({
        labels: {
          street2: 'Apartment or unit number',
        },
        omit: ['street3'],
      }),
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
          address: addressSchema({
            omit: ['street3'],
          }),
        },
      },
    },
  },
};
