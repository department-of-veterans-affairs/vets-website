module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['name'],
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['audience_tags'] },
        name: { type: 'string' },
      },
    },
  },
  required: ['entity'],
};
