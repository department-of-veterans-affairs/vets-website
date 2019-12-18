const transform = entity => ({
  entity: {
    entityType: 'block_content',
    entityBundle: 'promo',
    fieldImage: entity.fieldImage,
    fieldPromoLink: entity.fieldPromoLink,
  },
});
module.exports = {
  filter: ['field_image', 'field_promo_link'],
  transform,
};
