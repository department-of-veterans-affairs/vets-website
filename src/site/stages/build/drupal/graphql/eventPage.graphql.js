/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const moment = require('moment');

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

const firstDayOfMonthUnixStamp = moment()
  .second(0)
  .minute(0)
  .hour(0)
  .date(1)
  .unix();

const GetNodeEventPages = `
  ${eventPage}

  query GetNodeEventPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "field_datetime_range_timezone.end_value", value: ["${firstDayOfMonthUnixStamp}"], operator: GREATER_THAN },
      ]
    }) {
      entities {
        ... eventPage
      }
    }
  }
`;

const GetArchivedNodeEventPages = `
${eventPage}

query GetNodeEventPages($onlyPublishedContent: Boolean!) {
  nodeQuery(limit: 1000, filter: {
    conditions: [
      { field: "status", value: ["1"], enabled: $onlyPublishedContent },
      { field: "type", value: ["event"] },
      { field: "field_datetime_range_timezone.end_value", value: ["${firstDayOfMonthUnixStamp}"], operator: SMALLER_THAN_OR_EQUAL },
    ]
  }) {
    entities {
      ... eventPage
    }
  }
}
`;

module.exports = {
  fragment: eventPage,
  GetNodeEventPages,
  GetArchivedNodeEventPages,
};
