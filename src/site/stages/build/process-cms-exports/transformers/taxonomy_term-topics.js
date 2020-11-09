const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'topics',
    name: getDrupalValue(entity.name),
  },
});

module.exports = {
  filter: ['name'],
  transform,
};
