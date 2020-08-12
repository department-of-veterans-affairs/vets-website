const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'press_releases_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0],
  fieldPressReleaseBlurb: getDrupalValue(entity.fieldPressReleaseBlurb),
  reverseFieldListingNode: {
    entities: entity.reverseFieldList
      ? entity.reverseFieldList
          .filter(
            reverseField =>
              reverseField.entityBundle === 'press_release' &&
              reverseField.entityPublished,
          )
          .map(reverseField => ({
            entityId: reverseField.entityId,
            title: reverseField.title,
            fieldReleaseDate: reverseField.fieldReleaseDate,
            entityUrl: reverseField.entityUrl,
            promote: reverseField.promote,
            created: reverseField.created,
            fieldIntroText: reverseField.fieldIntroText,
            entityPublished: reverseField.entityPublished,
          }))
          .sort((a, b) => b.created - a.created)
      : [],
  },
  entityPublished: isPublished(getDrupalValue(entity.status)),
  status: getDrupalValue(entity.status),
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'field_press_release_blurb',
    'reverse_field_list',
    'status',
  ],
  transform,
};
