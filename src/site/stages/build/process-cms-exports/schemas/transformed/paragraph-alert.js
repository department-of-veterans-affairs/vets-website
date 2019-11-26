module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        contentModelType: { type: 'string', enum: ['paragraph-alert'] },
        entityType: { type: 'string' },
        entityBundle: { type: 'string' },
        fieldAlertType: { type: 'string' },
        fieldAlertHeading: { type: 'string' },
        fieldVaParagraphs: {
          type: 'array',
          items: { $ref: 'Paragraph' },
        },
        fieldAlertBlockReference: {
          type: ['null', 'array'],
          items: {
            $ref: 'BlockContent',
          },
        },
      },
      required: [
        'contentModelType',
        'entityType',
        'entityBundle',
        'fieldAlertType',
        'fieldAlertHeading',
        'fieldVaParagraphs',
        'fieldAlertBlockReference',
      ],
    },
  },
  required: ['entity'],
};
