export const uiSchema = {
  'ui:title': 'Your work history',
  personalData: {
    employmentHistory: {
      veteran: {
        isEmployed: {
          'ui:title': 'Do you currently have a job?',
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
                isEmployed: {
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
