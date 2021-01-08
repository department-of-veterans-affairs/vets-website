module.exports = `
  allTaxonomies: taxonomyTermQuery(limit: 1000) {
    entities {
      entityBundle
      ... taxonomyTermAudienceBeneficiaries
      ... taxonomyTermAudienceNonBeneficiaries
      ... taxonomyTermLcCategories
    }
  }
`;
