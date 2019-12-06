const { getDrupalValue, getRawParentFieldName } = require('./helpers');

const transform = (entity, uuid, ancestors) => ({
  entity: {
    parentFieldName: getRawParentFieldName(ancestors[ancestors.length], uuid),
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
