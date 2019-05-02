module.exports = `
  outreachAssets: nodeQuery(filter: {conditions: [{field: "type", value: "outreach_asset"}]}, limit: 10000) {
    entities {
      ... on NodeOutreachAsset {
        entityId
        title
        status
        changed
        fieldFormat
        fieldBenefits
        fieldDescription
        fieldMedia {
          entity {
            ... on MediaImage {
              entityBundle
              image {
                url
              }
            }
            ... on MediaDocument {
              entityBundle
              fieldDocument {
                entity {
                  url
                }
              }
            }
            ... on MediaVideo {
              entityBundle
              fieldMediaVideoEmbedField
            }
          }
        }
      }
    }
  }
`;
