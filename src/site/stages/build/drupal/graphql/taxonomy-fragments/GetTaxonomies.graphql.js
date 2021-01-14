module.exports = `
  allTaxonomies: taxonomyTermQuery(limit: 1000) {
    entities {
      entityBundle
      ... on TaxonomyTermAudienceBeneficiaries {
        entityUrl {
          path
        }
        name
      }

      ... on TaxonomyTermAudienceNonBeneficiaries {
        entityUrl {
          path
        }
        name
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
