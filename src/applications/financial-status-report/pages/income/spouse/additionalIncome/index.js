export const uiSchema = {
  'ui:title': 'Your spouse information',
  questions: {
    spouseHasAdditionalIncome: {
      'ui:title':
        'Does your spouse get income from any other sources (like a retirement pension or alimony support)? ',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your spouse’s other income.',
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
        spouseHasAdditionalIncome: {
          type: 'boolean',
        },
      },
    },
  },
};
