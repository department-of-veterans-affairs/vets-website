const { ApolloClient } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const CONTENT_APIS = require('../../../constants/content-apis');

function getApiClient(buildOptions) {
  const contentApiRoute = `${CONTENT_APIS[buildOptions.buildtype]}/graphql`;
  const link = createHttpLink({ uri: contentApiRoute, fetch });
  const cache = new InMemoryCache();
  const contentApi = new ApolloClient({ link, cache });

  return contentApi;
}

module.exports = getApiClient;
