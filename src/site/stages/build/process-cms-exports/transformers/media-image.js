const { createMetaTagArray, getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'media',
  entityBundle: 'image',
  name: getDrupalValue(entity.name),
  thumbnail: entity.thumbnail[0],
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
  fieldOwner: entity.fieldOwner[0],
  image: {
    alt: entity.image[0].alt || '',
    title: entity.image[0].title || '',
    url: encodeURI(entity.thumbnail[0].url.replace('public:/', '/img')),
    derivative: {
      url: encodeURI(entity.thumbnail[0].url.replace('public:/', '/img')),
      width: entity.image[0].width,
      height: entity.image[0].height,
    },
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
