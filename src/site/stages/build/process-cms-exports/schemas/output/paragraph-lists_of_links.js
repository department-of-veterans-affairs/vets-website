module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-lists_of_links'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['lists_of_links'] },
      },
      required: [],
    },
  },
  required: ['entity'],
};
