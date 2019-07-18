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
    fieldOffice {
      targetId
      entity {
        reverseFieldOfficeNode(limit: 500, sort: {field: "changed", direction: DESC}) {
            entities {
              ... on NodeEvent {
                title
                entityUrl {
                  path
                }
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
      }
    }
 }
`;
