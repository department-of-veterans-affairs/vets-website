const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'taxonomy_term',
      entityBundle: 'audience_tags',
      name: getDrupalValue(entity.name),
    },
  };
};

module.exports = {
  filter: ['name'],
  transform,
};
