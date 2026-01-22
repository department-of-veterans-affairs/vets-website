import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const addressSchema = addressNoMilitarySchema({
  omit: ['isMilitary', 'street3'],
  extend: {
    street: { maxLength: 30 },
    street2: { maxLength: 5 },
    city: { maxLength: 18 },
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Organization’s address'),
    organizationAddress: addressNoMilitaryUI({
      labels: {
        country: 'Organization’s country',
        street: 'Organization’s street address',
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      organizationAddress: addressSchema,
    },
    required: ['organizationAddress'],
  },
};
