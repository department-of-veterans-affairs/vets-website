const { ApolloClient } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const DRUPALS = require('../../../constants/drupals');

function getDrupalClient(buildOptions) {
  const drupalUri = `${DRUPALS[buildOptions.buildtype]}/graphql`;
  const link = createHttpLink({ uri: drupalUri, fetch });
  const cache = new InMemoryCache();
  const drupalClient = new ApolloClient({ link, cache });

  return drupalClient;
}

module.exports = getDrupalClient;
