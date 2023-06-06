import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { discloseFinancialInformation } = fullSchemaHca.properties;

export default {
  uiSchema: {
    discloseFinancialInformation: {
      'ui:title':
        'Select whether you want to provide your household financial information.',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes, I want to provide my household financial information',
          N: 'No, I don’t want to provide my household financial information',
        },
      },
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
