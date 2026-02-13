import {
  addressSchema,
  addressUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const mailingAddressPage = {
  uiSchema: {
    ...titleUI({
      title: 'Mailing address',
      description:
        'We’ll send any important information about your application to this address.',
      headerLevel: 1,
    }),
    mailingAddress: addressUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['street3'],
      required: true,
      city: {
        'ui:errorMessages': {
          required: 'Select a post office type: APO, FPO, or DPO',
        },
      },
      state: {
        'ui:errorMessages': {
          required: 'Please enter a valid State, Province, or Region',
        },
      },
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
