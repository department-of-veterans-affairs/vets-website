export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  additionalData: {
    bankruptcy: {
      hasBeenAdjucatedBankrupt: {
        'ui:title': 'Have you ever declared bankruptcy?',
        'ui:required': () => true,
        'ui:widget': 'yesNo',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalData: {
      type: 'object',
      properties: {
        bankruptcy: {
          type: 'object',
          properties: {
            hasBeenAdjucatedBankrupt: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
