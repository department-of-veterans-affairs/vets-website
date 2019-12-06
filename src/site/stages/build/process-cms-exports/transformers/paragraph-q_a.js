const { getDrupalValue, getRawParentFieldName } = require('./helpers');

const transform = (entity, uuid, ancestors) => ({
  entity: {
    // TODO: Pass the ancestry tree into the transformer
    // TODO: Pass the UUID of the current entity into the transformer
    // TODO: Write a helper to look up the UUID in an entity and return the property name it's found in
    // TODO: Use all the above to look up the parentFieldName

    // The snake-cased name of the parent field
    //
    // For example, if this `paragraph-q_a` was in a
    // `fieldQuestions` property in the parent entity, the value of
    // `parentFieldName` would be `field_questions`
    parentFieldName: getRawParentFieldName(ancestors[ancestors.length], uuid),
    entityType: 'paragraph',
    entityBundle: 'q_a',
    fieldAnswer: entity.fieldAnswer,
    fieldQuestion: getDrupalValue(entity.fieldQuestion),
  },
});
module.exports = {
  filters: ['field_answer', 'field_question'],
  transform,
};
