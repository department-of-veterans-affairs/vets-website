const { getDrupalValue, getRawParentFieldName } = require('./helpers');

const transform = (entity, uuid, ancestors) => ({
  entity: {
    parentFieldName: ancestors.length
      ? getRawParentFieldName(ancestors[ancestors.length - 1].entity, uuid)
      : // The entity in the unit test won't have any parents
        '',
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
