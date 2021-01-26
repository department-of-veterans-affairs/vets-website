/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');

module.exports = `
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
          fieldNicknameForThisFacility
        }
      }
    }
 }
`;
