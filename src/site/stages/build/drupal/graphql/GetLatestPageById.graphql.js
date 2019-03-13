const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const fragments = require('./fragments.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const alertsQuery = require('./alerts.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');

/**
 * Queries for a page by the node id, getting the latest revision
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}
  ${pressReleasePage}
  ${newsStoryPage}
  ${eventPage}

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
        ... eventPage
      }
    }
    ${icsFileQuery}
    ${sidebarQuery}
    ${facilitySidebarQuery}
    ${alertsQuery}
  }
`;
