/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const EVENTS_RESULTS = `
  entities {
    ... on NodeEvent {
        title
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

      entityUrl {
        path
      }
    }

`;

function queryFilter(isAll) {
  return `
  reverseFieldOfficeNode (filter: {
  conditions: [
    { field: "type", value: "event"}
    { field: "status", value: "1"}
    ${
      isAll
        ? ''
        : '{ field: "field_date", value: [$today], operator: GREATER_THAN}'
    }
  ]} sort: {field: "field_date", direction: ASC } limit: ${isAll ? '500' : '2'})
  `;
}

module.exports = `
  eventTeasers: ${queryFilter(false)}
  {
    ${EVENTS_RESULTS}
  }
  allEventTeasers: ${queryFilter(true)}
  {
    ${EVENTS_RESULTS}
  }
`;
