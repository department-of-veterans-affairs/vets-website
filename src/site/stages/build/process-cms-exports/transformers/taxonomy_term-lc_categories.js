// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'taxonomy_term',
      entityBundle: 'lc_categories',
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
