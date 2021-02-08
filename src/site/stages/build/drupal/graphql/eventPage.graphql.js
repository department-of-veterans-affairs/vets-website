/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const eventPage = `
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

function getNodeEventSlice(operationName, offset, limit = 200) {
  return `
    ${eventPage}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "field_datetime_range_timezone.end_value", direction:  ASC }
        filter: {
        conditions: [
          { field: "status", value: ["1"], enabled: $onlyPublishedContent },
          { field: "type", value: ["event"] }
        ]
      }) {
        entities {
          ... eventPage
        }
      }
    }
  `;
}

module.exports = {
  fragment: eventPage,
  GetNodeEventsSlice1: getNodeEventSlice('GetNodeEventsSlice1', 0),
  GetNodeEventsSlice2: getNodeEventSlice('GetNodeEventsSlice1', 200),
  GetNodeEventsSlice3: getNodeEventSlice('GetNodeEventsSlice1', 400, 9999),
};
