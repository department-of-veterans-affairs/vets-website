export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  questions: {
    hasBeenAdjucatedBankrupt: {
      'ui:title': 'Have you ever declared bankruptcy?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasBeenAdjucatedBankrupt: {
          type: 'boolean',
        },
      },
    },
  },
};
