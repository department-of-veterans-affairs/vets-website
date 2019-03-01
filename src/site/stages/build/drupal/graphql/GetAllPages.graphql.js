const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');
const pressReleasePage = require('./pressReleasePage.graphql');
const fragments = require('./fragments.graphql');
const newsStoryPage = require('./newStoryPage.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');
const facilitySidebarQuery = require('./navigation-fragments/facilitySidebar.nav.graphql');

/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}
  ${pressReleasePage}
  ${newsStoryPage}

  query GetAllPages {
    nodeQuery(limit: 500) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
        ... pressReleasePage
        ... newsStoryPage
      }
    }
    ${sidebarQuery}
    ${facilitySidebarQuery}
  }
`;
