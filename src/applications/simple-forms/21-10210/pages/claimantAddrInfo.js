import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const pdfSchema = addressNoMilitarySchema({
  omit: ['street3'],
});
pdfSchema.properties.street.maxLength = 30;
pdfSchema.properties.street2.maxLength = 30;
pdfSchema.properties.city.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Mailing address'),
    claimantMailingAddress: addressNoMilitaryUI({
      omit: ['street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantMailingAddress: pdfSchema,
    },
    required: ['claimantMailingAddress'],
  },
};
