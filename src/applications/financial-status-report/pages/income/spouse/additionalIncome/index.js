export const uiSchema = {
  'ui:title': 'Your spouse information',
  income: {
    spouse: {
      hasAdditionalIncome: {
        'ui:title':
          'Does your spouse get income from any other sources (like a retirement pension or alimony support)?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    income: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            hasAdditionalIncome: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
