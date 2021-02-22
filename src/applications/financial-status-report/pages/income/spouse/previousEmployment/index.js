export const uiSchema = {
  'ui:title': 'Your spouse information',
  employment: {
    spouse: {
      previouslyEmployed: {
        'ui:title': 'Has your spouse had any other jobs in the past 2 years?',
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
            previouslyEmployed: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
