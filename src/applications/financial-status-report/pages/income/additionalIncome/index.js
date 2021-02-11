export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasAdditionalIncome: {
      'ui:title':
        'Do you get income from any other sources (like a retirement pension or alimony support)?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        hasAdditionalIncome: {
          type: 'boolean',
        },
      },
    },
  },
};
