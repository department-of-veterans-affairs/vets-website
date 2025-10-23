export const uiSchema = {
  'ui:title': 'Unemployability Status',
  'view:unemployabilityStatus': {
    'ui:title':
      'Are you currently unemployed or at risk of unemployment due to any of your service-connected disabilities?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:unemployabilityStatus'],
  properties: {
    'view:unemployabilityStatus': {
      type: 'boolean',
    },
  },
};
