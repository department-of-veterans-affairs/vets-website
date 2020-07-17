const transform = entity => ({
  entity: {
    entityType: 'block_content',
    entityBundle: 'promo',
    fieldImage: entity.fieldImage[0],
    fieldPromoLink: entity.fieldPromoLink[0],
  },
});
module.exports = {
  filter: ['field_image', 'field_promo_link'],
  transform,
};
