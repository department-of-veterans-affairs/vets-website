export const uiSchema = {
  'ui:title': 'Your work history',
  questions: {
    vetIsEmployed: {
      'ui:title': 'Do you currently have a job?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        vetIsEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
