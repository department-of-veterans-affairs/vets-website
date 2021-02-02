const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'press_releases_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0]
    ? {
        entity: !ancestors.find(
          r => r.entity.uuid === entity.fieldOffice[0].uuid,
        )
          ? entity.fieldOffice[0]
          : {
              entityLabel: getDrupalValue(entity.fieldOffice[0].title),
              entityType: entity.fieldOffice[0].entityType,
            },
      }
    : null,
  fieldPressReleaseBlurb: getDrupalValue(entity.fieldPressReleaseBlurb),
  reverseFieldListingNode: {
    entities: entity.reverseFieldListing
      ? entity.reverseFieldListing
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
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'field_press_release_blurb',
    'reverse_field_listing',
    'status',
  ],
  transform,
};
