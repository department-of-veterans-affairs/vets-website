const {
  getDrupalValue,
  createMetaTagArray,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'publication_listing',
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityUrl: {
    breadcrumb: [],
    path: entity.path[0].alias,
  },
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: entity.fieldOffice[0],
});
module.exports = {
  filter: [
    'title',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_intro_text',
    'field_office',
  ],
  transform,
};
