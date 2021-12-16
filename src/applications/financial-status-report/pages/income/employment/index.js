export const uiSchema = {
  'ui:title': 'Your work history',
  questions: {
    vetIsEmployed: {
      'ui:title': 'Have you had any jobs in the last 2 years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your employment information.',
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
        vetIsEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
