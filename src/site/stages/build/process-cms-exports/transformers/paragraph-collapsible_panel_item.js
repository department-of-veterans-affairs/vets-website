const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'collapsible_panel_item',
    fieldTitle: getDrupalValue(entity.fieldTitle),
    fieldVaParagraphs: entity.fieldVaParagraphs || [],
    fieldWysiwyg: entity.fieldWysiwyg.length
      ? {
          processed: getWysiwygString(getDrupalValue(entity.fieldWysiwyg)),
        }
      : null,
  },
});
module.exports = {
  filter: ['field_title', 'field_va_paragraphs', 'field_wysiwyg'],
  transform,
};
