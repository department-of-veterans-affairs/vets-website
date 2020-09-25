const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const reverseFields = reverseFieldListing => ({
  entities: reverseFieldListing
    ? reverseFieldListing
        .filter(
          reverseField =>
            reverseField.entityBundle === 'press_release' &&
            reverseField.status,
        )
        .map(reverseField => ({
          title: reverseField.title,
          entityUrl: reverseField.entityUrl,
          uid: reverseField.uid,
          fieldFeatured: reverseField.fieldFeatured,
          fieldDate: reverseField.fieldDate,
          fieldDescription: reverseField.fieldDescription,
          fieldLocationHumanreadable: reverseField.fieldLocationHumanreadable,
        }))
    : [],
});

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'press_releases_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(entity.created),
  changed: utcToEpochTime(entity.changed),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice:
    entity.fieldOffice[0] &&
    !ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid)
      ? { entity: entity.fieldOffice[0] }
      : null,
  fieldPressReleaseBlurb: getDrupalValue(entity.fieldPressReleaseBlurb),
  reverseFieldListingNode: reverseFields(entity.reverseFieldListing),
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
    'reverse_field_listing',
  ],
  transform,
};
