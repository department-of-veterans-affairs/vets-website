module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['media-image'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['media'] },
        entityBundle: { enum: ['image'] },
        image: { type: 'string' },
      },
      required: ['image'],
    },
  },
  required: ['entity'],
};
