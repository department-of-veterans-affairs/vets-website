module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['topics'] },
        name: { type: 'string' },
        entityUrl: {
          type: 'object',
          required: ['path'],
          properties: {
            path: { type: 'string' },
          },
        },
      },
      required: ['name', 'entityUrl'],
    },
  },
  required: ['entity'],
};
