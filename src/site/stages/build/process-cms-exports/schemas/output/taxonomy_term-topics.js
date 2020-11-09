module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['topics'] },
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: ['entity'],
};
