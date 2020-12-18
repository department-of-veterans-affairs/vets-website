const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'taxonomy_term',
      entityBundle: 'audience_beneficiaries',
      entityUrl: {
        path: entity.path[0].alias,
      },
      name: getDrupalValue(entity.name),
    },
  };
};

module.exports = {
  filter: ['name', 'path'],
  transform,
};
