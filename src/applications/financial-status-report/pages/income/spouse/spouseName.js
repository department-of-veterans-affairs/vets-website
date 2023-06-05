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
  },
};
