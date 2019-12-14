/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_image: { $ref: 'EntityReferenceArray' },
    field_promo_link: { $ref: 'EntityReferenceArray' },
  },
  required: ['field_image', 'field_promo_link'],
};
