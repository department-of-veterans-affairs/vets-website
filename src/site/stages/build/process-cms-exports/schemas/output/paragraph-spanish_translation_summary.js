module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-spanish_translation_summary'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['spanish_translation_summary'] },
        fieldTextExpander: { type: 'string' },
        fieldWysiwyg: { $ref: 'ProcessedString' },
      },
      required: ['fieldTextExpander', 'fieldWysiwyg'],
    },
  },
  required: ['entity'],
};
