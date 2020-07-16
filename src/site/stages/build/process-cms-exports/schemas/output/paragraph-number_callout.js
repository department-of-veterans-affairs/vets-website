module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-number_callout'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['number_callout'] },
        fieldShortPhraseWithANumber: { type: 'string' },
        fieldWysiwyg: { $ref: 'ProcessedString' },
      },
      required: ['fieldShortPhraseWithANumber', 'fieldWysiwyg'],
    },
  },
  required: ['entity'],
};
