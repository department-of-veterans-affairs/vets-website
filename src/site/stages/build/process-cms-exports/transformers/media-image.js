const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'media',
  entityBundle: 'image',
  name: getDrupalValue(entity.name),
  thumbnail: entity.thumbnail[0],
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldMediaInLibrary: getDrupalValue(entity.fieldMediaInLibrary),
  fieldOwner: entity.fieldOwner[0],
  image: entity.image[0],
});

module.exports = {
  filter: [
    'name',
    'thumbnail',
    'created',
    'changed',
    'metatag',
    'field_media_in_library',
    'field_owner',
    'image',
  ],
  transform,
};
