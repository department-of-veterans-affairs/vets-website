module.exports = {
  type: 'object',
  properties: {
    contentModelType: { type: 'string', enum: ['paragraph-alert'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { type: 'string' },
        entityBundle: { type: 'string' },
        fieldAlertType: { type: 'string' },
        fieldAlertHeading: { type: ['string', 'null'] },
        fieldVaParagraphs: {
          type: ['array', 'null'],
          items: { $ref: 'Paragraph' },
        },
        fieldAlertBlockReference: {
          oneOf: [{ $ref: 'BlockContent' }, { type: 'null' }],
        },
      },
      required: [
        'entityBundle',
        'entityType',
        'fieldAlertBlockReference',
        'fieldAlertHeading',
        'fieldAlertType',
        'fieldVaParagraphs',
      ],
    },
  },
  required: ['contentModelType', 'entity'],
};
