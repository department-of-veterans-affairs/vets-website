module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-office'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['office'] },
        entityLabel: { type: 'string' },
      },
      required: ['entityLabel'],
    },
  },
  required: ['entity'],
};
