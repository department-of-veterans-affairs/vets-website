import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const pdfSchema = addressNoMilitarySchema({
  omit: ['street3'],
  extend: {
    street: { maxLength: 30 },
    street2: { maxLength: 30 },
    city: { maxLength: 18 },
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Mailing address'),
    veteranMailingAddress: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['street3'],
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
