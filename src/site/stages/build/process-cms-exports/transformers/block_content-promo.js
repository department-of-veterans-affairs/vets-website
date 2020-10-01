const { getImageCrop } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'block_content',
    entityBundle: 'promo',
    fieldImage: {
      entity: getImageCrop(entity.fieldImage[0], '_32MEDIUMTHUMBNAIL'),
    },
    fieldPromoLink: entity.fieldPromoLink[0],
  },
});
module.exports = {
  filter: ['field_image', 'field_promo_link'],
  transform,
};
