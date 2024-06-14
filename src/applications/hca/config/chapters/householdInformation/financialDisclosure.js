import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { discloseFinancialInformation } = fullSchemaHca.properties;

export default {
  uiSchema: {
    discloseFinancialInformation: {
      'ui:title': 'Do you want to share your household financial information?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation,
    },
  },
};
