/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const pressReleasesListingPage = `
 fragment pressReleasesListingPage on NodePressReleasesListing {
    ${entityElementsFromPages}
    fieldIntroText
    reverseFieldListingNode(limit: 500, filter: {conditions: [{field: "type", value: "press_release"}, {field: "status", value: "1", operator: EQUAL}]}) {
      entities {
        ... on NodePressRelease {
          entityId
          title
          fieldReleaseDate {
            value
          }
          entityUrl {
            path
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
          promote
          created
          fieldIntroText
        }
      }
    }
    fieldOffice {
      targetId
      entity {
        ... on NodeHealthCareRegionPage {
          entityLabel
          title
        }
      }
    }
 }
`;

const GetNodePressReleaseListingPages = `

  ${pressReleasesListingPage}

  query GetNodePressReleaseListingPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["press_releases_listing"] }
      ]
    }) {
      entities {
        ... pressReleasesListingPage
      }
    }
  }
`;

module.exports = {
  fragment: pressReleasesListingPage,
  GetNodePressReleaseListingPages,
};
