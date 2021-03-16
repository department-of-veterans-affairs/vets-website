/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const benefitListingPage = `
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

const GetNodePublicationListingPages = `

  ${benefitListingPage}

  query GetNodePublicationListingPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["publication_listing"] }
      ]
    }) {
      entities {
        ... benefitListingPage
      }
    }
  }
`;

module.exports = {
  fragment: benefitListingPage,
  GetNodePublicationListingPages,
};
