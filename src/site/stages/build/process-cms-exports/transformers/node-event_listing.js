const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
  isPublished,
} = require('./helpers');

const reverseFields = reverseFieldList => ({
  entities: reverseFieldList
    .filter(
      reverseField =>
        reverseField.entityBundle === 'event' && reverseField.status,
    )
    .map(reverseField => ({
      title: reverseField.title,
      entityUrl: reverseField.entityUrl,
      uid: reverseField.uid,
      fieldFeatured: reverseField.fieldFeatured,
      fieldDate: reverseField.fieldDate,
      fieldDescription: reverseField.fieldDescription,
      fieldLocationHumanreadable: reverseField.fieldLocationHumanreadable,
    })),
});

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'event_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0],
  reverseFieldListingNode: reverseFields(entity.reverseFieldList),
  pastEvents: reverseFields(entity.reverseFieldList),
});
module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'moderation_state',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'reverse_field_list',
  ],
  transform,
};
