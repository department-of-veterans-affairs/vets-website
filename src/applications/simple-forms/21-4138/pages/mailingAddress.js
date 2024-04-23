import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const nonVeteranMailingAddressPage = {
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

/** @type {PageSchema} */
export const veteranMailingAddressPage = {
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
