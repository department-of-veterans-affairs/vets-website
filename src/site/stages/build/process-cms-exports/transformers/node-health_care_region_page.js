const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_page',
    entityPublished: getDrupalValue(entity.moderationState) === 'published',
    entityLabel: getDrupalValue(entity.title),
    title: getDrupalValue(entity.title),
    entityUrl: {
      path: entity.path[0].alias.replace(/\\/g, ''),
    },
    fieldNicknameForThisFacility: getDrupalValue(
      entity.fieldNicknameForThisFacility,
    ),
  },
});
module.exports = {
  filter: [
    'title',
    'moderation_state',
    'path',
    'field_nickname_for_this_facility',
  ],
  transform,
};
