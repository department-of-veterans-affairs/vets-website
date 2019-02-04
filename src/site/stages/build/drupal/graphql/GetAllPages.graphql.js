/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */

const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const fragments = require('./fragments.graphql');
const sideNav = require('./nav-fragments/sidebarAll.nav.graphql');

const LANDING_PAGE = '... landingPage';
const BASIC_PAGE = '... page';
const SIDE_NAV = '... sideNav';

module.exports = `

  ${fragments}
  ${landingPage}
  ${page}
  ${sideNav}
  
  query GetAllPages {
    nodeQuery(limit: 500) {
      entities {
        ${LANDING_PAGE}
        ${BASIC_PAGE}
      }
    }
    taxonomyTermQuery {
      entities {
        ... on TaxonomyTermSidebarNavigation {
            ${SIDE_NAV}
        }
      } 
    }
  }

`;
