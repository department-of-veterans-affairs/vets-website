/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment benefitListingPage on NodePublicationListing {
    ${entityElementsFromPages}
    changed
    title
    fieldIntroText
    entityId
    fieldOffice {
      targetId
    }
 }
`;
