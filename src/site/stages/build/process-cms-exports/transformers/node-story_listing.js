const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'story_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  entityPublished: isPublished(getDrupalValue(entity.status)),
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
              // TODO: Can we just change the templates to use entityLabel?
              title: getDrupalValue(entity.fieldOffice[0].title),
              entityType: entity.fieldOffice[0].entityType,
            },
      }
    : null,
  reverseFieldListingNode: {
    entities: entity.reverseFieldListing
      ? entity.reverseFieldListing
          .filter(
            reverseField =>
              reverseField.entityBundle === 'news_story' &&
              reverseField.entityPublished,
          )
          .map(reverseField => ({
            entityId: reverseField.entityId,
            title: reverseField.title,
            fieldFeatured: reverseField.fieldFeatured,
            entityUrl: reverseField.entityUrl,
            entityPublished: reverseField.entityPublished,
            entityBundle: reverseField.entityBundle,
            // Ignoring for now since some uids are missing from the export
            // uid: reverseField.uid,
            promote: reverseField.promote,
            created: reverseField.created,
            fieldAuthor: reverseField.fieldAuthor,
            fieldImageCaption: reverseField.fieldImageCaption,
            fieldIntroText: reverseField.fieldIntroText,
            fieldMedia: reverseField.fieldMedia,
            fieldFullStory: reverseField.fieldFullStory,
          }))
          .sort((a, b) => b.created - a.created)
      : [],
  },
});

module.exports = {
  filter: [
    'title',
    'created',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'reverse_field_listing',
    'status',
  ],
  transform,
};
