import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedAddressSchema = addressSchema({
  omit: ['street3', 'isMilitary'],
});
updatedAddressSchema.properties.street.maxLength = 30;
updatedAddressSchema.properties.street2.maxLength = 5;
updatedAddressSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI("Custodian's mailing address"),
    custodianAddress: {
      ...addressUI({
        omit: ['isMilitary', 'street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      custodianAddress: updatedAddressSchema,
    },
    required: ['custodianAddress'],
  },
};
