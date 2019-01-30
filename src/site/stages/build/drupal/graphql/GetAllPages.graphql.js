/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */

const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const taxonomyTermSidebarNavigation = require('./nav-fragments/sidebarAll.nav.graphql');

const SIDE_NAV = `...${taxonomyTermSidebarNavigation}`;


module.exports = `

  ${landingPage}
  ${page}
  
  query GetAllPages {
    nodeQuery(limit: 100) {
      entities {
        ... landingPage
        ... page
      }
    }
    taxonomyTermQuery {
      entities {
        ${SIDE_NAV}
      } 
    }
  }

`;
