const queries = {
  GET_ALL_PAGES: './graphql/GetAllPages.graphql',
  GET_LATEST_PAGE_BY_ID: './graphql/GetLatestPageById.graphql',
};

function getQuery(query) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(query);
}

module.exports = {
  getQuery,
  queries,
};
