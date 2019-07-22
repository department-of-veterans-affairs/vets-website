/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../../utilities/featureFlags');

let featuredContent;

if (enabledFeatureFlags[featureFlags.FEATURE_LISTING_FEATURED_CONTENT]) {
  featuredContent = `
    fieldFeatured
    fieldOrder
  `;
}

const EVENTS_RESULTS = `
  entities {
    ... on NodeEvent {
        title
        ${featuredContent}
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
