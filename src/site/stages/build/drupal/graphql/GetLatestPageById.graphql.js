const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const fragments = require('./fragments.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');

/**
 * Queries for a page by the node id, getting the latest revision
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}
  ${newsStoryPage}
  ${pressReleasePage}

  query GetLatestPageById($id: String!, $today: String!) {
    nodes: nodeQuery(revisions: LATEST, filter: {
    conditions: [
      { field: "nid", value: [$id] }
    ]
    }) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
        ... newsStoryPage
        ... pressReleasePage
      }
    }
    ${sidebarQuery}
    ${facilitySidebarQuery}
  }
`;
