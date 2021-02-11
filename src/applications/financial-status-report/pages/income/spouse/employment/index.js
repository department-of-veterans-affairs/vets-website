export const uiSchema = {
  'ui:title': 'Your spouse information',
  employment: {
    spouse: {
      spouseName: {
        'ui:title': "What is your spouse's name?",
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
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
    employment: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            spouseName: {
              type: 'string',
            },
            isEmployed: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
