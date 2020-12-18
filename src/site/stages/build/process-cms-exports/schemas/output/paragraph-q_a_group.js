module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-q_a_group'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['q_a_group'] },
        fieldAccordionDisplay: { type: 'boolean' },
        fieldQAs: {
          type: 'array',
          items: { $ref: 'output/node-q_a' },
        },
        fieldSectionHeader: { type: ['string', 'null'] },
      },
      required: ['fieldAccordionDisplay', 'fieldQAs', 'fieldSectionHeader'],
    },
  },
  required: ['entity'],
};
