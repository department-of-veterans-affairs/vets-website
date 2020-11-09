// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'rich_text_char_limit_1000',
});

module.exports = {
  filter: [''],
  transform,
};
