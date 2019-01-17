const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');

module.exports = `

  ${landingPage}
  ${page}

  query GetPageById($path: String!) {
    route: route(path: $path) {
      ... on EntityCanonicalUrl {
        entity {
          ... landingPage
          ... page
        }
      }
    }
  }

`;
