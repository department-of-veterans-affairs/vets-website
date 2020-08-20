const { createMetaTagArray, getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'image',
    name: getDrupalValue(entity.name),
    thumbnail: entity.thumbnail[0],
    entityMetatags: createMetaTagArray(entity.metatag.value),
    fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
    fieldOwner: entity.fieldOwner[0],
    image: entity.image[0],
  },
});

module.exports = {
  filter: [
    'name',
    'thumbnail',
    'metatag',
    'field_media_in_library',
    'field_owner',
    'image',
  ],
  transform,
};
