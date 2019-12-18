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
          type: 'object',
          properties: { processed: { type: 'string' } },
        },
      },
      required: ['fieldTitle', 'fieldVaParagraphs', 'fieldWysiwyg'],
    },
  },
  required: ['entity'],
};
