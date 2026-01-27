import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedAddressSchema = addressSchema({
  omit: ['street3'],
  extend: {
    street: { maxLength: 74 },
    street2: { maxLength: 13 },
    city: { maxLength: 22 },
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about your application to this address.',
    ),
    claimantAddress: addressUI({
      labels: {
        street2: 'Apartment or unit number',
        militaryCheckbox:
          'I receive mail outside of the United States on a U.S. military base',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantAddress'],
    properties: {
      claimantAddress: updatedAddressSchema,
    },
  },
};
