export const uiSchema = {
  'ui:title': 'Your spouse information',
  personalData: {
    spouseFullName: {
      'ui:title': 'What’s your spouse’s name?',
      'ui:options': {
        widgetClassNames: 'input-size-3',
      },
    },
  },
  questions: {
    spouseIsEmployed: {
      'ui:title': 'Does your spouse currently have a job?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
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
    questions: {
      type: 'object',
      properties: {
        spouseIsEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
