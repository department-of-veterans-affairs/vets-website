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
    nonVeteranMailingAddress: addressUI({
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
      nonVeteranMailingAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
