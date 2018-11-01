export const uiSchema = {
  'ui:title': 'Unemployment Status',
  'view:unemploymentStatus': {
    'ui:title':
      'Are you currently unemployed or at risk of unemployment due to any of your service-connected disabilities?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:unemploymentStatus'],
  properties: {
    'view:unemploymentStatus': {
      type: 'boolean',
    },
  },
};
