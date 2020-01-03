const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_region_page',
    title: getDrupalValue(entity.title),
    path: getDrupalValue(entity.path),
    fieldNicknameForThisFacility: getDrupalValue(
      entity.fieldNicknameForThisFacility,
    ),
  },
});
module.exports = {
  filter: ['title', 'path', 'field_nickname_for_this_facility'],
  transform,
};
