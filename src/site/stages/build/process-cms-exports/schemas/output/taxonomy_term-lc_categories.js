module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        entityUrl: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
        },
      },
    },
  },
};
