export const uiSchema = {
  'ui:title': 'Your other income',
  questions: {
    hasSocialSecurity: {
      'ui:title': 'Do you get Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your Social Security benefits information.',
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
        hasSocialSecurity: {
          type: 'boolean',
        },
      },
    },
  },
};
