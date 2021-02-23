/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const eventListingPage = `
 fragment eventListingPage on NodeEventListing {
    ${entityElementsFromPages}
    changed
    title
    fieldIntroText
    entityId
    pastEvents: reverseFieldListingNode(limit: 500, filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "type", value: "event"}]}, sort: {field: "changed", direction: DESC}) {
          entities {
            ... on NodeEvent {
              title
              entityUrl {
                path
              }
              fieldFeatured
              fieldDatetimeRangeTimezone {
                value
                endValue
                timezone
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
    reverseFieldListingNode(limit: 500, filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "type", value: "event"}]}, sort: {field: "changed", direction: DESC}) {
        entities {
          ... on NodeEvent {
            title
            entityUrl {
              path
            }
            fieldFeatured
            fieldDatetimeRangeTimezone {
              value
              endValue
              timezone
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
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
        }
      }
    }
 }
`;

const GetNodeEventListingPage = `

  ${eventListingPage}

  query GetNodeEventListingPage($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["event_listing"] }
      ]
    }) {
      entities {
        ... eventListingPage
      }
    }
  }
`;

module.exports = {
  fragment: eventListingPage,
  GetNodeEventListingPage,
};
