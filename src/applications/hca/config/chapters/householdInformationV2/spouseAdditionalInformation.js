import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { cohabitedLastYear, sameAddress } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s additional information',
    'ui:description':
      'Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.',
    cohabitedLastYear: {
      'ui:title': 'Did your spouse live with you last year?',
      'ui:widget': 'yesNo',
    },
    sameAddress: {
      'ui:title': 'Do you have the same address as your spouse?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['sameAddress'],
    properties: {
      cohabitedLastYear,
      sameAddress,
    },
  },
};
