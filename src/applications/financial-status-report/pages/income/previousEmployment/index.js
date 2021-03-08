export const uiSchema = {
  'ui:title': 'Your work history',
  personalData: {
    employmentHistory: {
      veteran: {
        previouslyEmployed: {
          'ui:title': 'Have you had any other jobs in the past 2 years?',
          'ui:widget': 'yesNo',
          'ui:required': () => true,
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            veteran: {
              type: 'object',
              properties: {
                previouslyEmployed: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  },
};
