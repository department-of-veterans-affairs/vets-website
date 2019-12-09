const { getDrupalValue } = require('./helpers');

const transform = (entity, { parentFieldName }) => ({
  entity: {
    parentFieldName,
    entityType: 'paragraph',
    entityBundle: 'q_a',
    fieldAnswer: entity.fieldAnswer,
    fieldQuestion: getDrupalValue(entity.fieldQuestion),
  },
});

module.exports = {
  filter: ['field_answer', 'field_question'],
  transform,
};
