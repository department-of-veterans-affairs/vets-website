const { createMetaTagArray, getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'video',
    name: getDrupalValue(entity.name),
    thumbnail: entity.thumbnail[0],
    entityMetatags: createMetaTagArray(entity.metatag.value),
    fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
    fieldMediaVideoEmbedField: getDrupalValue(entity.fieldMediaVideoEmbedField),
  },
});

module.exports = {
  filter: [
    'name',
    'thumbnail',
    'metatag',
    'field_media_in_library',
    'field_media_video_embed_field',
  ],
  transform,
};
