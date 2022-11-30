export const uiSchema = {
  'ui:title': 'Your work history',
  questions: {
    vetHasAdditionalEmployment: {
      'ui:title': 'Have you had another job in the last 2 years?',
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
        vetHasAdditionalEmployment: {
          type: 'boolean',
        },
      },
    },
  },
};
