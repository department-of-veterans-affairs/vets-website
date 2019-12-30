const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'document',
    name: getDrupalValue(entity.name),
    path: getDrupalValue(entity.path),
  },
});
module.exports = {
  filter: ['name', 'path'],
  transform,
};
