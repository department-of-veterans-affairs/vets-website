module.exports = {
  type: 'object',
  properties: {
    parentFieldName: {
      // The snake-cased name of the parent field
      //
      // For example, if this `paragraph-q_a` was in a
      // `fieldQuestions` property in the parent entity, the value of
      // `parentFieldName` would be `field_questions`
      type: 'string',
    },
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
