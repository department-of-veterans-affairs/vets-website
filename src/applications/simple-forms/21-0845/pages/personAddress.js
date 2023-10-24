import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const pdfSchema = addressNoMilitarySchema({
  omit: ['isMilitary', 'street3'],
});
pdfSchema.properties.street.maxLength = 30;
pdfSchema.properties.street2.maxLength = 5;
pdfSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Person’s address'),
    personAddress: addressNoMilitaryUI({
      labels: { street2: 'Apartment or unit number' },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      personAddress: pdfSchema,
    },
    required: ['personAddress'],
  },
};
