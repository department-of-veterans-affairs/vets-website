import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedAddressSchema = addressSchema({
  omit: ['street3', 'isMilitary'],
  extend: {
    street: { maxLength: 30 },
    street2: { maxLength: 5 },
    city: { maxLength: 18 },
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s mailing address'),
    custodianAddress: addressUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      custodianAddress: updatedAddressSchema,
    },
    required: ['custodianAddress'],
  },
};
