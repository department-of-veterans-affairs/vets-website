export const uiSchema = {
  'ui:title': 'Your spouse information',
  personalData: {
    spouseFullName: {
      'ui:title': 'What’s your spouse’s name?',
      'ui:options': {
        widgetClassNames: 'input-size-3',
      },
    },
    employmentHistory: {
      spouse: {
        isEmployed: {
          'ui:title': 'Does your spouse currently have a job?',
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
        spouseFullName: {
          type: 'string',
        },
        employmentHistory: {
          type: 'object',
          properties: {
            spouse: {
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
