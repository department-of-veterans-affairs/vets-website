const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const healthCareRegionPage = require('./healthCareRegionPage.graphql');
const fragments = require('./fragments.graphql');
const sidebarQuery = require('./navigation-fragments/sidebar.nav.graphql');

/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${healthCareRegionPage}

  query GetAllPages {
    nodeQuery(limit: 500) {
      entities {
        ... landingPage
        ... page
        ... healthCareRegionPage
      }
    }
    ${sidebarQuery}
  }

`;
