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
        'ui:errorMessages': {
          required: "Please enter your spouse's first name.",
        },
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
      'ui:title': 'Has your spouse had any jobs in the past 2 years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your spouse’s employment information.',
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
