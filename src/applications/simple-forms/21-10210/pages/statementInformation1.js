export default {
  uiSchema: {
    claimOwnership: {
      'ui:title':
        "Are you submitting this statement to support your claim or someone else's claim?",
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          self: 'My own claim',
          'third-party': 'Someone else’s claim',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimOwnership'],
    properties: {
      claimOwnership: {
        type: 'string',
        enum: ['self', 'third-party'],
      },
    },
  },
};
