// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'lists_of_links',
});

module.exports = {
  filter: [''],
  transform,
};
