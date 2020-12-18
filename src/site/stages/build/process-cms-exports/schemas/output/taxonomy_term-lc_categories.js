module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      required: ['name', 'entityUrl'],
      properties: {
        name: { type: 'string' },
        entityUrl: {
          type: 'object',
          required: ['path'],
          properties: {
            path: { type: 'string' },
          },
        },
      },
    },
  },
};
