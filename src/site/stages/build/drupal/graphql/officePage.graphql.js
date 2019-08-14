/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
// Get current feature flags
const { enabledFeatureFlags } = global;

module.exports = `
 fragment officePage on NodeOffice {
    ${entityElementsFromPages}
    changed
    title
    fieldDescription
    ${enabledFeatureFlags.FEATURE_FIELD_BODY ? 'fieldBody { processed }' : ''}
    reverseFieldOfficeNode {
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
`;
