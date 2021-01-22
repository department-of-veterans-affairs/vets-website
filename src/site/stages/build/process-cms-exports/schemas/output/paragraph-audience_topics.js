module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      required: ['fieldAudienceBeneficiares', 'fieldTopics'],
      properties: {
        entityType: { type: 'string', enum: ['paragraph'] },
        entityBundle: { type: 'string', enum: ['audience_topics'] },
        fieldAudienceBeneficiares: {
          oneOf: [
            { $ref: 'output/taxonomy_term-audience_beneficiaries' },
            { type: 'null' },
          ],
        },
        fieldTopics: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: 'output/taxonomy_term-topics' },
              { type: 'array', maxItems: 0 },
            ],
          },
        },
      },
    },
  },
};
