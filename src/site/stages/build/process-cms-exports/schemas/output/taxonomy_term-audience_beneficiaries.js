module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['name', 'entityUrl'],
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['audience_beneficiaries'] },
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
  required: ['entity'],
};
