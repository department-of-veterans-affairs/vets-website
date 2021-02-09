export const uiSchema = {
  'ui:title': 'Your employment history',
  employment: {
    isEmployed: {
      'ui:title': 'Do you have a job now?',
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
        isEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
