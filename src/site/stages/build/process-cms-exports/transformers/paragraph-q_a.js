const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    // TODO: Pass the ancestry tree into the transformer
    // TODO: Pass the UUID of the current entity into the transformer
    // TODO: Write a helper to look up the UUID in an entity and return the property name it's found in
    // TODO: Use all the above to look up the parentFieldName
    parentFieldName: '',
    entityType: 'paragraph',
    entityBundle: 'q_a',
    fieldAnswer: getDrupalValue(entity.fieldAnswer),
    fieldQuestion: getDrupalValue(entity.fieldQuestion),
  },
});
module.exports = {
  filters: ['field_answer', 'field_question'],
  transform,
};
