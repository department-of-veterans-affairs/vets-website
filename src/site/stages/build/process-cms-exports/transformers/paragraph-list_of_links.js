// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entityType: 'paragraph',
    entityBundle: 'list_of_links',
    entity: {
      fieldLink: entity.fieldLink[0],
      fieldLinks: entity.fieldLinks,
      fieldSectionHeader: getDrupalValue(entity.fieldSectionHeader),
    },
  };
};

module.exports = {
  filter: ['field_section_header', 'field_link', 'field_links'],
  transform,
};
