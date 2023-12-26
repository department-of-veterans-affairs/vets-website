export const uiSchema = {
  'ui:title': 'Individual Unemployability',
  'ui:description':
    'If you can’t work because of a service-connected condition or disability, you may be eligible for Individual Unemployability benefits. This includes increased disability payments.',
  'view:unemployable': {
    'ui:title':
      'Does your condition or disability prevent you from keeping a job that you could otherwise do? (This doesn’t include being retired.)',
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
