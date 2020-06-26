const { paragraph, media } = require('../helpers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['block_content-promo'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['block_content'] },
        entityBundle: { enum: ['promo'] },
        fieldImage: media(),
        fieldPromoLink: paragraph(),
      },
      required: ['fieldImage', 'fieldPromoLink'],
    },
  },
  required: ['entity'],
};
