/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');

const locationListingPage = `
 fragment locationListingPage on NodeLocationsListing {
    ${entityElementsFromPages}
    title
    entityId
    fieldIntroText
    fieldMetaTags
    fieldMetaTitle
    fieldOffice {
      targetId
      entity {
        ...on NodeHealthCareRegionPage {
          ${healthCareLocalFacilities}
          fieldOtherVaLocations
          entityLabel
          title
        }
      }
    }
 }
`;

const GetNodeLocationsListingPages = `

  ${locationListingPage}

  query GetNodeLocationsListingPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["locations_listing"] }
      ]
    }) {
      entities {
        ... locationListingPage
      }
    }
  }
`;

module.exports = {
  fragment: locationListingPage,
  GetNodeLocationsListingPages,
};
