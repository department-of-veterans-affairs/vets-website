/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_collapsible_panel_bordered: { $ref: 'GenericNestedBoolean' },
    field_collapsible_panel_expand: { $ref: 'GenericNestedBoolean' },
    field_collapsible_panel_multi: { $ref: 'GenericNestedBoolean' },
    field_va_paragraphs: { $ref: 'EntityReferenceArray' },
  },
};
