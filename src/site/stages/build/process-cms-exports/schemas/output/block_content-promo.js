module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['block_content-promo'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['block_content'] },
        entityBundle: { enum: ['promo'] },
        fieldImage: { $ref: 'Media' },
        fieldPromoLink: { $ref: 'Paragraph' },
      },
      required: ['fieldImage', 'fieldPromoLink'],
    },
  },
  required: ['entity'],
};
