module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['user'] },
    targetId: { type: 'number' },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['user'] },
        entityBundle: { enum: [''] },
        name: { type: 'string' },
        timezone: { type: ['string', 'null'] },
      },
      required: ['name', 'timezone'],
    },
  },
  required: ['targetId', 'entity'],
};
