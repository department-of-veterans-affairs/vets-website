module.exports = `
  allTaxonomies: taxonomyTermQuery(limit: 1000) {
    entities {
      entityBundle
      ... on TaxonomyTermAudienceBeneficiaries {
        entityUrl {
          path
        }
        name
        fieldAudienceRsHomepage
      }

      ... on TaxonomyTermAudienceNonBeneficiaries {
        entityUrl {
          path
        }
        name
        fieldAudienceRsHomepage
      }

      ... on TaxonomyTermLcCategories {
        entityUrl {
          path
        }
        name
      }
    }
  }
`;
