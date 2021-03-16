module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-lists_of_links'] },
    entityType: { enum: ['paragraph'] },
    entityBundle: { enum: ['lists_of_links'] },
    entity: {
      type: 'object',
      properties: {
        fieldSectionHeader: { type: ['string', 'null'] },
        fieldVaParagraphs: { type: 'array' },
      },
      required: ['fieldSectionHeader', 'fieldVaParagraphs'],
    },
  },
  required: ['entity'],
};
