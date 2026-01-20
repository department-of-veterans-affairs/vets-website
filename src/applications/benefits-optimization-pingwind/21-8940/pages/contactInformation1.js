import {
  inlineTitleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI(
        'How can we reach you?',
        'We need to collect some basic information about you first. ',
      ),
      [veteranFields.address]: addressUI({
        labels: {
          street2: 'Apartment or unit number',
          postalCode: 'ZIP code/Postal code',
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
