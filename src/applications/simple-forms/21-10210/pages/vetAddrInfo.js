import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const pdfSchema = addressNoMilitarySchema({
  omit: ['isMilitary', 'street3'],
});
pdfSchema.properties.street.maxLength = 30;
pdfSchema.properties.street2.maxLength = 30;
pdfSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranMailingAddress: addressNoMilitaryUI({
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranMailingAddress: pdfSchema,
    },
    required: ['veteranMailingAddress'],
  },
};
