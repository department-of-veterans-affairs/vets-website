export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  questions: {
    hasBeenAdjudicatedBankrupt: {
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
        hasBeenAdjudicatedBankrupt: {
          type: 'boolean',
        },
      },
    },
  },
};
