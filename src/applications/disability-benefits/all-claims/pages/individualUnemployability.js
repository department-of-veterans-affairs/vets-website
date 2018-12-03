export const uiSchema = {
  'ui:title': 'Individual Unemployability',
  'ui:description':
    'If you can’t work because of your service-connected disability you may be eligible for Individual Unemployability and increased disability payments.',
  'view:unemployable': {
    'ui:title':
      'Does your disability prevent you from holding down a job that you could otherwise do? (This doesn’t include being retired.)',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:unemployable': {
      type: 'boolean',
    },
  },
};
