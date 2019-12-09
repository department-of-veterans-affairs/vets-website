const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'q_a_section',
    fieldAccordionDisplay: getDrupalValue(entity.fieldAccordionDisplay),
    fieldQuestions: entity.fieldQuestions,
    fieldSectionHeader: getDrupalValue(entity.fieldSectionHeader),
    fieldSectionIntro: getDrupalValue(entity.fieldSectionIntro),
  },
});
module.exports = {
  filter: [
    'field_accordion_display',
    'field_questions',
    'field_section_header',
    'field_section_intro',
  ],
  transform,
};
