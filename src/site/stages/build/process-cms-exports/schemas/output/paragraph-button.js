module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: ['object', 'null'],
      required: [
        'entityId',
        'entityBundle',
        'fieldButtonLabel',
        'fieldButtonLink',
      ],
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
  },
};
