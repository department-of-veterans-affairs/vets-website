const queries = {
  GET_ALL_PAGES: 'GetAllPages.graphql',
  GET_LATEST_PAGE_BY_ID: 'GetLatestPageById.graphql',
};

function getQuery(query, { useTomeSync } = {}) {
  if (query === queries.GET_ALL_PAGES) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(`./graphql/${query}`)({ useTomeSync });
  }
  // eslint-disable-next-line import/no-dynamic-require
  return require(`./graphql/${query}`);
}

module.exports = {
  getQuery,
  queries,
};
