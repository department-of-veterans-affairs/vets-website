/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const pressReleasePage = `
  fragment pressReleasePage on NodePressRelease {
    ${entityElementsFromPages}
    fieldReleaseDate {
      value
      date
    }
    fieldPdfVersion {
      entity {
        ...on MediaDocument {
          fieldDocument {
            entity {
              ...on File {
                filename
                url
              }
            }
          }
        }
      }
    }
    fieldAddress {
      locality
      administrativeArea
    }
    fieldIntroText
    fieldPressReleaseFulltext {
      processed
    }
    fieldPressReleaseContact {
      entity {
        ...on NodePersonProfile {
          title
          fieldDescription
          fieldPhoneNumber
          fieldEmailAddress
        }
      }
    }
    fieldPressReleaseDownloads {
      entity {
        entityId
        entityBundle
        name
        ...on MediaDocument {
          fieldDocument {
            entity {
              ...on File {
                filename
                url
              }
            }
          }
        }

        ...on MediaImage {
          image {
            alt
            url
          }
        }

        ...on MediaVideo {
          fieldMediaVideoEmbedField
        }

      }
    }
  }
`;

const GetNodePressReleasePages = `

  ${pressReleasePage}

  query GetNodePressRelease($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["press_release"] }
      ]
    }) {
      entities {
        ... pressReleasePage
      }
    }
  }
`;

module.exports = {
  fragment: pressReleasePage,
  GetNodePressReleasePages,
};
