export const uiSchema = {
  'ui:title': 'Your work history',
  questions: {
    vetPreviouslyEmployed: {
      'ui:title': 'Have you had any other jobs in the past 2 years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        vetPreviouslyEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
