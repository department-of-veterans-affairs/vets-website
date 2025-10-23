import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const addressSchema = addressNoMilitarySchema({
  omit: ['isMilitary', 'street3'],
});
addressSchema.properties.street.maxLength = 30;
addressSchema.properties.street2.maxLength = 5;
addressSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerAddress: addressNoMilitaryUI({
      labels: { street2: 'Apartment or unit number' },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      authorizerAddress: addressSchema,
    },
    required: ['authorizerAddress'],
  },
};
