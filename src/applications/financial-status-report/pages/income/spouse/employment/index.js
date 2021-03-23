export const uiSchema = {
  'ui:title': 'Your spouse information',
  personalData: {
    spouseFullName: {
      first: {
        'ui:title': 'What’s your spouse’s first name?',
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
        'ui:required': () => true,
      },
      last: {
        'ui:title': 'What’s your spouse’s last name?',
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
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
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
          },
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
