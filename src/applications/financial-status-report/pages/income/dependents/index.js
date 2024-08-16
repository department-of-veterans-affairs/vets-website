export const schemaEnhanced = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasDependents'],
      properties: {
        hasDependents: {
          type: 'string',
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:dependentsAdditionalInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
