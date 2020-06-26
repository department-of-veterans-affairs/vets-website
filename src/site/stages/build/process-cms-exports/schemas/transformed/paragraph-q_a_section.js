const { paragraph } = require('../helpers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-q_a_section'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['q_a_section'] },
        fieldAccordionDisplay: { type: 'boolean' },
        fieldQuestions: {
          type: 'array',
          items: paragraph(),
        },
        fieldSectionHeader: { type: ['string', 'null'] },
        fieldSectionIntro: { type: ['string', 'null'] },
      },
      required: [
        'fieldAccordionDisplay',
        'fieldQuestions',
        'fieldSectionHeader',
        'fieldSectionIntro',
      ],
    },
  },
  required: ['entity'],
};
