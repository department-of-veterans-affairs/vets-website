module.exports = `
  allTaxonomies: taxonomyTermQuery(limit: 1000) {
    entities {
      entityBundle
      ... on TaxonomyTermAudienceBeneficiaries {
        fieldAudienceRsHomepage
        name
        path {
          alias
          pid
          langcode
          pathauto
        }
      }
    }
  }
`
