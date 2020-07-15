const {
  getDrupalValue,
  createMetaTagArray,
  isPublished,
  utcToEpochTime,
  getWysiwygString,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'news_story',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  promote: getDrupalValue(entity.promote),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  entityUrl: {
    // TODO: Get the breadcrumb from the CMS export when it's available
    breadcrumb: [],
    path: entity.path[0].alias,
  },
  fieldAuthor: entity.fieldAuthor[0] || null,
  fieldFullStory: {
    processed: getWysiwygString(getDrupalValue(entity.fieldFullStory)),
  },
  fieldImageCaption: getDrupalValue(entity.fieldImageCaption),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMedia: entity.fieldMedia[0] || null,
  fieldOffice: (entity.fieldOffice && entity.fieldOffice[0]) || null,
});
module.exports = {
  filter: [
    'title',
    'created',
    'promote',
    'moderation_state',
    'metatag',
    'path',
    'field_author',
    'field_full_story',
    'field_image_caption',
    'field_intro_text',
    'field_media',
    'field_office',
  ],
  transform,
};
