module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['taxonomy_term-products'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['taxonomy_term'] },
        entityBundle: { enum: ['products'] },
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: ['entity'],
};
