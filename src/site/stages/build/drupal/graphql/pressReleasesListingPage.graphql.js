/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment pressReleasesListingPage on NodePressReleasesListing {
    ${entityElementsFromPages}
    fieldIntroText
    fieldOffice {
      entity {
        title
        reverseFieldOfficeNode(limit: 500, filter: {conditions: [{field: "type", value: "press_release"}, {field: "status", value: "1", operator: EQUAL}]}) {
          entities {
            ... on NodePressRelease {
              entityId
              title
              entityUrl {
                path
              }
              uid {
                targetId
                ... on FieldNodeUid {
                  entity {
                    name
                    timezone
                  }
                }
              }
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
              fieldIntroText
            }
          }
        }
      }
    }
    fieldOffice {
      targetId
      entity {
        ... on NodeHealthCareRegionPage {
          entityLabel
          title
          fieldNicknameForThisFacility
        }
      }
    }
 }
`;
