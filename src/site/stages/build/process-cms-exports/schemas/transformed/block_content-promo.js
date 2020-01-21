module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['block_content-promo'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['block_content'] },
        entityBundle: { enum: ['promo'] },
        fieldImage: {
          type: 'array',
          items: { $ref: 'Media' },
        },
        fieldPromoLink: {
          type: 'array',
          items: { $ref: 'Paragraph' },
        },
      },
      required: ['fieldImage', 'fieldPromoLink'],
    },
  },
  required: ['entity'],
};
