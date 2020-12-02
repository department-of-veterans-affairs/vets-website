module.exports = {
  type: ['array', 'null'],
  items: {
    properties: {
      entityId: { type: 'string' },
      entityBundle: { type: 'string' },
      fieldButtonLabel: { type: 'string' },
      fieldButtonLink: {
        type: ['object', 'null'],
        properties: {
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['url'],
      },
    },
    required: [
      'entityId',
      'entityBundle',
      'fieldButtonLabel',
      'fieldButtonLink',
    ],
  },
};
