/**
 * NOTE: getImage() is expected to be called on this entity to get the
 * URL and dimensions (derivative) of the image crop the parent entity
 * wants.
 */

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'image',
    image: entity.image,
  },
});

module.exports = {
  filter: ['image'],
  transform,
};
