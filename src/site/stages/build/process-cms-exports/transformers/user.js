const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  targetId: getDrupalValue(entity.uid),
  entity: {
    entityType: 'user',
    entityBundle: '',
    name: getDrupalValue(entity.name),
    // Currently all timezones in pages.json are null...so...
    // TODO: Use the actual timezone and make sure there are
    // no bugs because when timezone !== null
    // timezone: getDrupalValue(entity.timezone),
    timezone: null,
  },
});
module.exports = {
  filter: ['uid', 'name', 'timezone'],
  transform,
};
