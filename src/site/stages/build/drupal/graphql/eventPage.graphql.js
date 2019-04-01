/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment eventPage on NodeEvent {
    ${entityElementsFromPages}
    changed
    title
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: CROP_7_2) {
              url
              width
              height
            }
          }
        }
      }
    }
    fieldDate {
        startDate
        value
        endDate
        endValue
    }
    fieldAddress {
      addressLine1
      addressLine2
      locality
      administrativeArea
    }
    fieldFacilityLocation {
      entity {
        ... on NodeHealthCareLocalFacility {
          title
          fieldFacilityLocatorApiId
          entityUrl {
            path
          }
        }
      }
    }
    fieldLocationHumanreadable
    fieldDescription
    fieldBody {
      processed
    }
    fieldEventCost
    fieldEventRegistrationrequired
    fieldAdditionalInformationAbo
 }
`;
