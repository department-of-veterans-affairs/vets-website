import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// import { getMailindAddressPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this request to this address.',
    ),
    veteranMailingAddress: addressUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranMailingAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
