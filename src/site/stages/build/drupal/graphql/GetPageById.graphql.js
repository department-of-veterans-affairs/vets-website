const Hub = require('./Hub.graphql');
const StandardPage = require('./StandardPage.graphql');

module.exports = `

  ${Hub}
  ${StandardPage}

  query GetPageById($path: String!) {
    route: route(path: $path) {
      ... on EntityCanonicalUrl {
        entity {
          ... Hub
          ... StandardPage
        }
      }
    }
  }

`;
