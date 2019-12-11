module.exports = {
  type: 'object',
  properties: {
    // entityId: { type: 'string' }, // Also should validate that the string is a number
    contentModelType: { enum: ['paragraph-q_a'] },
    entity: {
      type: 'object',
      properties: {
        parentFieldName: { type: 'string' },
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['q_a'] },
        fieldAnswer: {
          type: 'array',
          items: { $ref: 'Paragraph' },
        },
        fieldQuestion: { type: 'string' },
      },
      required: ['fieldAnswer', 'fieldQuestion'],
    },
  },
  required: ['entity'],
};
