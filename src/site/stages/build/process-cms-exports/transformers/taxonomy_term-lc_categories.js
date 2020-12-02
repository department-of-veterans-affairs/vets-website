// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'lc_categories',
    name: getDrupalValue(entity.name),
  },
});

module.exports = {
  filter: ['name'],
  transform,
};
