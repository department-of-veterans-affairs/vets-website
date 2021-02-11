export const uiSchema = {
  'ui:title': 'Your work history',
  employment: {
    isEmployed: {
      'ui:title': 'Do you currently have a job?',
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
