import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s mailing address',
      'We’ll send any important information about this request to this address.',
    ),
    veteranMailingAddress: addressUI({
      labels: {
        militaryCheckbox:
          'The Veteran lives on a United States military base outside of the U.S.',
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
