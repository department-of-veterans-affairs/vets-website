const queries = {
  GET_ALL_PAGES: './graphql/GetAllPages.graphql',
  GET_LATEST_PAGE_BY_ID: './graphql/GetLatestPageById.graphql',
};

function getQuery(query, { useTomeSync } = {}) {
  if (query === queries.GET_ALL_PAGES) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(query)({ useTomeSync });
  }
  // eslint-disable-next-line import/no-dynamic-require
  return require(query);
}

const { GetNodePages } = require('./graphql/page.graphql');
const { GetNodeLandingPages } = require('./graphql/landingPage.graphql');
const { GetNodeVaForms } = require('./graphql/vaFormPage.graphql');
const {
  GetNodeHealthCareRegionPages,
} = require('./graphql/healthCareRegionPage.graphql');

const individualQueries = {
  GetNodePages,
  GetNodeLandingPages,
  GetNodeVaForms,
  GetNodeHealthCareRegionPages,
};

module.exports = {
  getQuery,
  queries,
  individualQueries,
};
