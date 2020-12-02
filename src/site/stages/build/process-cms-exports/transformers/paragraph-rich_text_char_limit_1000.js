// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'rich_text_char_limit_1000',
    fieldWysiwyg: entity.fieldWysiwyg[0],
  },
});

module.exports = {
  filter: ['field_wysiwyg'],
  transform,
};
