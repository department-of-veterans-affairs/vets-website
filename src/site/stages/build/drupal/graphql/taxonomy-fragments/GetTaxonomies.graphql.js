module.exports = `
  allTaxonomies: taxonomyTermQuery(limit: 1000) {
    entities {
      entityBundle
      ... on TaxonomyTermAudienceNonBeneficiaries {
        fieldAudienceRsHomepage
        name
        path {
          alias
        }
      }
      ... on TaxonomyTermAudienceBeneficiaries {
        fieldAudienceRsHomepage
        name
        path {
          alias
        }
      }
    }
  }
`;
