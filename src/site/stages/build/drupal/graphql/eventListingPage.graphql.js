/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment eventListingPage on NodeEventListing {
    ${entityElementsFromPages}
    changed
    title
    fieldIntroText
    entityId
    reverseFieldListingNode(limit: 500, filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "type", value: "event"}]}, sort: {field: "changed", direction: DESC}) {
        entities {
          ... on NodeEvent {
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
            fieldFeatured
            fieldDate {
              startDate
              value
              endDate
              endValue
            }
            fieldDescription
            fieldLocationHumanreadable
            fieldFacilityLocation {
              entity {
                title
                entityUrl {
                  path
                }
              }
            }
        }
      }
    }
    fieldOffice {
      targetId
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
          title
          fieldNicknameForThisFacility
        }
      }
    }
 }
`;
