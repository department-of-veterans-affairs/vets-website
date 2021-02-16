const adjudicationOptions = [
  'Yes, I have been adjudicated as bankrupt.',
  'No, I haven’t been adjudicated as bankrupt.',
];

export const uiSchema = {
  'ui:title': 'Your bankruptcy history',
  bankruptcyHistory: {
    hasBeenAdjudicated: {
      'ui:title': 'Have you ever been adjudicated as bankrupt?',
      'ui:required': () => true,
      'ui:widget': 'radio',
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
          type: 'string',
          enum: adjudicationOptions,
        },
      },
    },
  },
};
