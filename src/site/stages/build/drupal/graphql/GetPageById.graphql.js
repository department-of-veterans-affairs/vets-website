const StandardPage = require('./StandardPage.graphql');

module.exports = `

  ${StandardPage}

  query GetPageById($path: String!) {
    route: route(path: $path) {
      ... on EntityCanonicalUrl {
        entity {
          ... StandardPage
        }
      }
    }
  }

`;
