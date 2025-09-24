import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
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
        required: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.address]: addressSchema({ omit: ['street3'] }),
        },
      },
    },
  },
};
