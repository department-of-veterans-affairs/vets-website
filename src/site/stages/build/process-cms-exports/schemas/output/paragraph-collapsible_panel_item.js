module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-collapsible_panel_item'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['collapsible_panel_item'] },
        fieldTitle: { type: 'string' },
        fieldVaParagraphs: {
          type: 'array',
          items: { $ref: 'Paragraph' },
        },
        fieldWysiwyg: {
          oneOf: [{ $ref: 'ProcessedString' }, { type: 'null' }],
        },
      },
      required: ['fieldTitle', 'fieldVaParagraphs', 'fieldWysiwyg'],
    },
  },
  required: ['entity'],
};
