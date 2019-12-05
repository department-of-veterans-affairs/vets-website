/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment newsStoryPage on NodeNewsStory {
    ${entityElementsFromPages}
    promote
    created
    fieldOffice {
      entity {
        ... on NodeHealthCareRegionPage {
          entityLabel
          entityUrl {
            ... on EntityCanonicalUrl {
              breadcrumb {
                url {
                  path
                  routed
                }
                text
              }
              path
            }
          }
        }
      }
    }
    fieldAuthor {
      entity {
        ...on NodePersonProfile {
          title
          fieldDescription
        }
      }
    }
    fieldImageCaption
    fieldIntroText
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: _21MEDIUMTHUMBNAIL) {
              url
              width
              height
            }
          }
        }
      }
    }
    fieldFullStory {
      processed
    }
  }
`;
