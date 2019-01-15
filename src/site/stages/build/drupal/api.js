const { ApolloClient } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const DRUPALS = require('../../../constants/drupals');

function getCredentials(drupalAddress) {
  const { username, password } = DRUPALS.CREDENTIALS[drupalAddress];
  const credentials = `${username}:${password}`;
  const credentialsEncoded = Buffer.from(credentials).toString('base64');
  return credentialsEncoded;
}

function getDrupalClient(buildOptions) {
  const drupalAddress = DRUPALS[buildOptions.buildtype];
  const drupalUri = `${drupalAddress}/graphql`;
  const credentials = getCredentials(drupalAddress);
  const headers = { Authorization: `Basic ${credentials}` };
  const link = createHttpLink({ uri: drupalUri, fetch, headers });

  const cache = new InMemoryCache();
  const drupalClient = new ApolloClient({ link, cache });

  return drupalClient;
}

module.exports = getDrupalClient;
