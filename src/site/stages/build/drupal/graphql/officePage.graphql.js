/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const officeFragment = `
 fragment officePage on NodeOffice {
    ${entityElementsFromPages}
    changed
    title
    fieldDescription
    fieldBody { processed }
    reverseFieldOfficeNode {
      entities {
    ... on NodeEvent {
        title
         entityUrl {
            path
        }
        fieldDatetimeRangeTimezone {
          value
          startTime
          endValue
          endTime
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
 }
`;

const GetNodeOffices = `

  ${officeFragment}

  query GetNodeOffices($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["office"] }
      ]
    }) {
      entities {
        ... officePage
      }
    }
  }
`;

module.exports = {
  fragment: officeFragment,
  GetNodeOffices,
};
