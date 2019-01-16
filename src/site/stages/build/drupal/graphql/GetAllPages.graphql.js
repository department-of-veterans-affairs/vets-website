const Hub = require('./Hub.graphql');
const StandardPage = require('./StandardPage.graphql');

module.exports = `

  ${Hub}
  ${StandardPage}

  query GetAllPages {
    nodeQuery {
      entities {
        ... Hub
        ... StandardPage
      }
    }
  }

`;
