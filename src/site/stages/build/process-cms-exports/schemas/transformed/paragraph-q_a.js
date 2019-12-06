module.exports = {
  type: 'object',
  properties: {
    parentFieldName: { type: 'string' },
    // entityId: { type: 'string' }, // Also should validate that the string is a number
    contentModelType: { enum: ['paragraph-q_a'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['q_a'] },
        fieldAnswer: { type: 'string' },
        fieldQuestion: { type: 'string' },
      },
      required: ['fieldAnswer', 'fieldQuestion'],
    },
  },
  required: ['entity'],
};
