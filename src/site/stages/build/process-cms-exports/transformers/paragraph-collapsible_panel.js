const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  contentModelType: entity.contentModelType,
  entity: {
    entityType: 'paragraph',
    entityBundle: 'collapsible_panel',
    fieldCollapsiblePanelBordered: getDrupalValue(
      entity.fieldCollapsiblePanelBordered,
    ),
    fieldCollapsiblePanelExpand: getDrupalValue(
      entity.fieldCollapsiblePanelExpand,
    ),
    fieldCollapsiblePanelMulti: getDrupalValue(
      entity.fieldCollapsiblePanelMulti,
    ),
    fieldVaParagraphs: entity.fieldVaParagraphs || [],
  },
});
module.exports = {
  filter: [
    'field_collapsible_panel_bordered',
    'field_collapsible_panel_expand',
    'field_collapsible_panel_multi',
    'field_va_paragraphs',
  ],
  transform,
};
