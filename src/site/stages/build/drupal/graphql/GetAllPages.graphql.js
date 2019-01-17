const landingPage = require('./landingPage.graphql');
const page = require('./page.graphql');

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
