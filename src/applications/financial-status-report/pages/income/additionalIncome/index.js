export const uiSchema = {
  'ui:title': 'Your other income',
  questions: {
    hasAdditionalIncome: {
      'ui:title':
        'Do you get income from any other sources (like a retirement pension or alimony support)?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your additional income information.',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasAdditionalIncome: {
          type: 'boolean',
        },
      },
    },
  },
};
