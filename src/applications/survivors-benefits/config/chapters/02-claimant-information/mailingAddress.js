import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedAddressSchema = addressSchema({
  omit: ['street3'],
  extend: {
    street: { maxLength: 30 },
    street2: { maxLength: 5 },
    city: { maxLength: 18 },
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Mailing address'),
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
