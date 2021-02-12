export const uiSchema = {
  'ui:title': 'Your spouse information',
  personalData: {
    spouseFullName: {
      'ui:title': "What is your spouse's name?",
      'ui:options': {
        widgetClassNames: 'input-size-3',
      },
    },
  },
  employment: {
    spouse: {
      isEmployed: {
        'ui:title': 'Does your spouse currently have a job?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
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
      },
    },
    employment: {
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
};
