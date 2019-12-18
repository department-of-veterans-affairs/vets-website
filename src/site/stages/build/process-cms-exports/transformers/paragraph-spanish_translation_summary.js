const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'spanish_translation_summary',
    fieldTextExpander: getDrupalValue(entity.fieldTextExpander),
    fieldWysiwyg: { processed: getDrupalValue(entity.fieldWysiwyg) },
  },
});
module.exports = {
  filter: ['field_text_expander', 'field_wysiwyg'],
  transform,
};
