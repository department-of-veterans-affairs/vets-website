// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'q_a_group',
  fieldSectionHeader: entity.fieldSectionHeader,
  fieldAccordionDisplay: entity.fieldAccordionDisplay,
  fieldQAs: entity.fieldQAs,
});

module.exports = {
  filter: ['fieldSectionHeader', 'fieldAccordionDisplay', 'fieldQAs'],
  transform,
};
