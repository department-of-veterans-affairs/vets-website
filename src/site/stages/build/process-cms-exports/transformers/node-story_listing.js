const entityFactory = require('../index');
const {
  getDrupalValue,
  createMetaTagArray,
  utcToEpochTime,
  isPublished,
  readEntity,
} = require('./helpers');

const transform = (entity, { contentDir }) => {
  const assembleEntityTree = entityFactory(contentDir);
  return {
    entityType: 'node',
    entityBundle: 'story_listing',
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
  }
};
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
