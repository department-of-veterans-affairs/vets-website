const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'topics',
    name: getDrupalValue(entity.name),
    entityUrl: {
      path: entity.path[0].alias,
    },
  },
});

module.exports = {
  filter: ['name', 'path'],
  transform,
};
