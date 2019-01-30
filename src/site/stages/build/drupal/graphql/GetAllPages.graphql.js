const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const taxonomyTermSidebarNavigation = require('./nav-fragments/sidebarAll.nav.graphql');

/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${landingPage}
  ${page}
  ${taxonomyTermSidebarNavigation}

  query GetAllPages {
    nodeQuery(limit: 100) {
      entities {
        ... landingPage
        ... page
      }
    }
    taxonomyTermQuery {
      entities {
        ... taxonomyTermSidebarNavigation
      } 
    }
  }
`;
