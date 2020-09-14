module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['media-document'] },
    entityType: { enum: ['media'] },
    entityBundle: { enum: ['document'] },
    fieldDocument: {
      type: 'object',
      properties: {
        entity: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
            url: { type: ['string', 'null'] },
          },
          required: ['filename', 'url'],
        },
      },
    },
  },
  required: ['fieldDocument'],
};
