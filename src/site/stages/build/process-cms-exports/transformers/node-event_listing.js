const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
  isPublished,
} = require('./helpers');

const reverseFields = reverseFieldListing => ({
  entities: reverseFieldListing
    ? reverseFieldListing
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
        }))
    : [],
});

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'event_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.status)),
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
  reverseFieldListingNode: reverseFields(entity.reverseFieldListing),
  pastEvents: reverseFields(entity.reverseFieldListing),
});
module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'status',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'reverse_field_listing',
  ],
  transform,
};
