// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'step_by_step',
      fieldStep: entity.fieldStep,
      fieldSectionHeader: getDrupalValue(entity.fieldSectionHeader),
    },
  };
};

module.exports = {
  filter: ['field_section_header', 'field_step'],
  transform,
};
