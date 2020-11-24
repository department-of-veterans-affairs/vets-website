const {
  getDrupalValue,
  createMetaTagArray,
  isPublished,
  utcToEpochTime,
  getWysiwygString,
  getImageCrop,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'news_story',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  promote: getDrupalValue(entity.promote),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  fieldAuthor: entity.fieldAuthor[0]
    ? {
        entity: {
          title: entity.fieldAuthor[0].title,
          fieldDescription: entity.fieldAuthor[0].fieldDescription,
        },
      }
    : null,
  fieldFullStory: {
    processed: getWysiwygString(getDrupalValue(entity.fieldFullStory)),
  },
  fieldImageCaption: getDrupalValue(entity.fieldImageCaption),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldListing: entity.fieldListing[0]
    ? {
        entity: { entityUrl: entity.fieldListing[0].entityUrl },
      }
    : null,
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length
      ? { entity: getImageCrop(entity.fieldMedia[0], '_21MEDIUMTHUMBNAIL') }
      : null,
  fieldOffice:
    entity.fieldOffice &&
    entity.fieldOffice[0] &&
    !ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid)
      ? { entity: entity.fieldOffice[0] }
      : null,
  // Needed for filtering reverse fields in other transformers
  status: getDrupalValue(entity.status),
  fieldFeatured: getDrupalValue(entity.fieldFeatured),
});
module.exports = {
  filter: [
    'title',
    // 'uid',
    'created',
    'promote',
    'metatag',
    'path',
    'field_author',
    'field_full_story',
    'field_image_caption',
    'field_intro_text',
    'field_listing',
    'field_media',
    'field_office',
    'status',
    'field_featured',
  ],
  transform,
};
