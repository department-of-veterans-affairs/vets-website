export const uiSchema = {
  'ui:title': 'Your spouse information',
  questions: {
    spousePreviouslyEmployed: {
      'ui:title': 'Has your spouse had any other jobs in the past 2 years?',
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
        spousePreviouslyEmployed: {
          type: 'boolean',
        },
      },
    },
  },
};
