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
    fieldVaParagraphs: entity.fieldVaParagraphs,
  },
});
module.exports = transform;
