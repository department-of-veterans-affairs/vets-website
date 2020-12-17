module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['taxonomy_term-products'] },
    entityType: { enum: ['taxonomy_term'] },
    entityBundle: { enum: ['products'] },
    name: { type: 'string' },
  },
  required: ['contentModelType', 'entityType', 'entityBundle', 'name'],
};
