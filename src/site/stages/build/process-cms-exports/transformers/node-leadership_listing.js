const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'leadership_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldLeadership: entity.fieldLeadership[0],
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0],
  reverseFieldListingNode: {
    entities: entity.reverseFieldList
      ? entity.reverseFieldList
          .filter(
            reverseField =>
              reverseField.entityBundle === 'person_profile' &&
              reverseField.isPublished,
          )
          .map(reverseField => ({
            title: reverseField.title,
            fieldNameFirst: reverseField.fieldNameFirst,
            fieldLastName: reverseField.fieldLastName,
            fieldSuffix: reverseField.fieldSuffix,
            fieldDescription: reverseField.fieldDescription,
            fieldOffice: reverseField.fieldOffice,
            fieldIntroText: reverseField.fieldIntroText,
            fieldPhotoAllowHiresDownload:
              reverseField.fieldPhotoAllowHiresDownload,
            fieldBody: reverseField.fieldBody,
            changed: reverseField.changed,
            entityUrl: reverseField.entityUrl,
            fieldMedia: reverseField.fieldMedia,
          }))
          .sort((a, b) => b.created - a.created)
      : [],
  },
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_leadership',
    'field_meta_title',
    'field_office',
    'reverse_field_list',
  ],
  transform,
};
