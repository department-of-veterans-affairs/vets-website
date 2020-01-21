const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'number_callout',
    fieldShortPhraseWithANumber: getDrupalValue(
      entity.fieldShortPhraseWithANumber,
    ),
    fieldWysiwyg: { processed: getDrupalValue(entity.fieldWysiwyg) },
  },
});
module.exports = {
  filter: ['field_short_phrase_with_a_number', 'field_wysiwyg'],
  transform,
};
