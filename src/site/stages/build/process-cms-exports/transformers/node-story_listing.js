const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'story_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0],
  reverseFieldListingNode: {
    entities: entity.reverseFieldList
      ? entity.reverseFieldList
          .filter(
            reverseField =>
              reverseField.entityBundle === 'news_story' &&
              reverseField.isPublished,
          )
          .map(reverseField => ({
            entityId: reverseField.entityId,
            title: reverseField.title,
            fieldFeatured: reverseField.fieldFeatured,
            entityUrl: reverseField.entityUrl,
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
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
    'reverse_field_list',
    'status',
  ],
  transform,
};
