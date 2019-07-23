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
        fieldOffice {
          targetId
        }
        fieldMedia {
          entity {
            ... on MediaImage {
              entityBundle
              image {
                entity{
                  filesize
                }
                url
                alt
              }
            }
            ... on MediaDocument {
              entityBundle
              fieldDocument {
                entity {
                  filesize
                  url
                }
              }
            }
            ... on MediaVideo {
              entityBundle
              fieldMediaVideoEmbedField
              thumbnail {
                derivative(style: LARGE) {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;
