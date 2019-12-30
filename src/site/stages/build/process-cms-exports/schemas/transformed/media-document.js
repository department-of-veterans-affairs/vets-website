module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['media-document'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['media'] },
        entityBundle: { enum: ['document'] },
        name: { type: 'string' },
        path: { type: 'string' },
      },
      required: ['name', 'path'],
    },
  },
  required: ['entity'],
};
