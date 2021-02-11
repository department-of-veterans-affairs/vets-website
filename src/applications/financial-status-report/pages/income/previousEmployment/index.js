export const uiSchema = {
  'ui:title': 'Your employment history',
  employment: {
    previouslyEmployed: {
      'ui:title': 'Have you had any other jobs in the past 2 years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    employment: {
      type: 'object',
      properties: {
        previouslyEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
