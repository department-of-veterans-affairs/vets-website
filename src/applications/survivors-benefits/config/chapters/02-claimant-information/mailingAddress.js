import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedAddressSchema = addressSchema({
  omit: ['isMilitary', 'street3'],
});
updatedAddressSchema.properties.street.maxLength = 30;
updatedAddressSchema.properties.street2.maxLength = 5;
updatedAddressSchema.properties.city.maxLength = 18;

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
