/**
 * Home page
 */

module.exports = `
 fragment entitySubqueueById(id: "home_page_hub_list") {
  ... on EntitySubqueueHomePageHubList {
    itemsOfEntitySubqueueHomePageHubList {
      targetId
      entity {
        ... on NodeLandingPage {
          entityId
          entityLabel
          fieldDescription
        }
      }
    }
  }
}
`;
