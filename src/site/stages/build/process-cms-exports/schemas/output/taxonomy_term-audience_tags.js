module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['name', 'entityUrl'],
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['audience_tags'] },
        name: { type: 'string' },
      },
    },
  },
  required: ['entity'],
};
