const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'collapsible_panel_item',
    fieldTitle: getDrupalValue(entity.fieldTitle),
    fieldVaParagraphs: entity.fieldVaParagraphs,
    fieldWysiwyg: {
      processed: getWysiwygString(entity.fieldWysiwyg.processed),
    },
  },
});
module.exports = {
  filter: ['field_title', 'field_va_paragraphs', 'field_wysiwyg'],
  transform,
};
