const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'media',
  entityBundle: 'video',
  name: getDrupalValue(entity.name),
  thumbnail: entity.thumbnail[0],
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
  fieldMediaVideoEmbedField: getDrupalValue(entity.fieldMediaVideoEmbedField),
  fieldOwner: entity.fieldOwner[0],
});

module.exports = {
  filter: [
    'name',
    'thumbnail',
    'created',
    'changed',
    'metatag',
    'field_media_in_library',
    'field_media_video_embed_field',
    'field_owner',
  ],
  transform,
};
