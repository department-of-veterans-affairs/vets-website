const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');
const healthCareLocalFacilityPage = require('./healthCareLocalFacilityPage.graphql');
const healthCareRegionDetailPage = require('./healthCareRegionDetailPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const fragments = require('./fragments.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const alertsQuery = require('./alerts.graphql');
const eventPage = require('./eventPage.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');
const icsFileQuery = require('./file-fragments/ics.file.graphql');
const bioPage = require('./bioPage.graphql');
/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}
  ${healthCareLocalFacilityPage}
  ${healthCareRegionDetailPage}
  ${pressReleasePage}
  ${newsStoryPage}
  ${eventPage}
  ${bioPage}

  query GetAllPages($today: String!, $onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent }
      ]
    }) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
        ... healthCareLocalFacilityPage
        ... healthCareRegionDetailPage
        ... pressReleasePage
        ... newsStoryPage
        ... eventPage
        ... bioPage
      }
    }
    ${icsFileQuery}
    ${sidebarQuery}
    ${facilitySidebarQuery}
    ${alertsQuery}
  }
`;
