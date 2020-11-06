module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string', enum: ['taxonomy_term'] },
        entityBundle: { type: 'string', enum: ['audience_beneficiaries'] },
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: ['entity'],
};
