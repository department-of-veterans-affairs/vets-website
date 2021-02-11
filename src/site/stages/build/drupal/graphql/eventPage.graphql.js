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
            derivative(style: _72MEDIUMTHUMBNAIL) {
              url
              width
              height
            }
          }
        }
      }
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
    fieldDate {
        startDate
        value
        endDate
        endValue
    }
    fieldDatetimeRangeTimezone {
      value
      endValue
      timezone
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
    fieldEventCta
    fieldLink {
      url {
        path
      }
    }
    fieldEventRegistrationrequired
    fieldAdditionalInformationAbo {processed}
 }
`;
