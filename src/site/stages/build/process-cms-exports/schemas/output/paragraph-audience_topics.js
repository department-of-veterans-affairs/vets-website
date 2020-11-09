module.exports = {
  type: 'object',
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
      oneOf: [
        { $ref: 'output/taxonomy_term-topics' },
        { type: 'array', maxItems: 0 },
      ],
    },
  },
  required: ['fieldAudienceBeneficiares', 'fieldTopics'],
};
