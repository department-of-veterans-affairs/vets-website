const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'audience_topics',
    fieldAudienceBeneficiares: entity.fieldAudienceBeneficiares[0]
      ? entity.fieldAudienceBeneficiares[0]
      : null,
    fieldTopics: entity.fieldTopics,
  },
});

module.exports = {
  filter: ['field_audience_beneficiares', 'field_topics'],
  transform,
};
