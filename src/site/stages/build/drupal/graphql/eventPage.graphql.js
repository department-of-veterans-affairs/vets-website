/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

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

function getNodeEventSlice(operationName, offset, limit = 100) {
  return `
    ${eventPage}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
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

function getNodeEventQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeEvents',
    entitiesPerSlice: 50,
    totalEntities: entityCounts.data.event.count,
    getSlice: getNodeEventSlice,
  });
}

module.exports = {
  fragment: eventPage,
  getNodeEventQueries,
};
