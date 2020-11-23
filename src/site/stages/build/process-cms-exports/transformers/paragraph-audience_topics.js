const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'audience_topics',
  fieldAudienceBeneficiares: entity.fieldAudienceBeneficiares[0]
    ? entity.fieldAudienceBeneficiares[0]
    : null,
  fieldTopics: entity.fieldTopics[0] ? entity.fieldTopics[0] : [],
});

module.exports = {
  filter: ['field_audience_beneficiares', 'field_topics'],
  transform,
};
