const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'media',
    entityBundle: 'document',
    name: getDrupalValue(entity.name),
    path: entity.path[0].alias,
  },
});
module.exports = {
  filter: ['name', 'path'],
  transform,
};
