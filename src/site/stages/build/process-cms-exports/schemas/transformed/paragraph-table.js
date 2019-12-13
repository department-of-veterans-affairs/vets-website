module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-table'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['table'] },
        fieldTable: { type: 'string' },
      },
      required: ['fieldTable'],
    },
  },
  required: ['entity'],
};
