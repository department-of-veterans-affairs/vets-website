const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');
const fragments = require('./fragments.graphql');

/**
 * Queries for a page by the page path. This will most likely need to be updated once we determine
 * how we'll query for drafts - will we switch to nodeId, or something else?
 * To execute, run this query at http://staging.va.agile6.com/graphql/explorer.
 */
module.exports = `

  ${fragments}
  ${landingPage}
  ${page}

  query GetLatestPageById($id: String!) {
    nodes: nodeQuery(revisions: LATEST, filter: {
    conditions: [
      { field: "nid", value: [$id] }
    ]
    }) {
      entities {
        ... landingPage
        ... page
      }
    }
  }

`;
