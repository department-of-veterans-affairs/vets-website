import {
  addressSchema,
  addressUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const mailingAddressPage = {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      'We’ll send any important information about your application to this address.',
      1,
      'vads-u-color--black',
    ),
    mailingAddress: addressUI({
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
      mailingAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
