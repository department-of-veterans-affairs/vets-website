export const uiSchema = {
  'ui:title': 'Your bankruptcy details',
  bankruptcyHistory: {
    hasBeenAdjudicated: {
      'ui:title': 'Have you ever declared bankruptcy?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    bankruptcyHistory: {
      type: 'object',
      properties: {
        hasBeenAdjudicated: {
          type: 'boolean',
        },
      },
    },
  },
};
