const { ApolloClient } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const DRUPALS = require('../../../constants/drupals');

function encodeCredentials({ username, password }) {
  const credentials = `${username}:${password}`;
  const credentialsEncoded = Buffer.from(credentials).toString('base64');
  return credentialsEncoded;
}

function getDrupalClient(buildOptions) {
  const { address, credentials } = DRUPALS[buildOptions.buildtype];
  const drupalUri = `${address}/graphql`;
  const encodedCredentials = encodeCredentials(credentials);
  const headers = { Authorization: `Basic ${encodedCredentials}` };
  const link = createHttpLink({ uri: drupalUri, fetch, headers });

  const cache = new InMemoryCache();
  const drupalClient = new ApolloClient({ link, cache });

  return drupalClient;
}

module.exports = getDrupalClient;
