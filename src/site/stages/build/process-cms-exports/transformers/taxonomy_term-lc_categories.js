// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'taxonomy_term',
  entityBundle: 'lc_categories',
});

module.exports = {
  filter: [''],
  transform,
};
