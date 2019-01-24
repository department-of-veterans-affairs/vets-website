const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');

/**
 * Queries for all of the pages out of Drupal
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${landingPage}
  ${page}

  query GetAllPages {
    nodeQuery {
      entities {
        ... landingPage
        ... page
      }
    }
  }

`;

console.log(module.exports);
