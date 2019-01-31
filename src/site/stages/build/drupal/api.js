const fetch = require('node-fetch');

const GET_ALL_PAGES = require('./graphql/GetAllPages.graphql');
const GET_PAGE_BY_ID = require('./graphql/GetPageById.graphql');

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
  const headers = {
    Authorization: `Basic ${encodedCredentials}`,
    'Content-Type': 'application/json',
  };

  return {
    async query(args) {
      const response = await fetch(drupalUri, {
        headers,
        method: 'post',
        mode: 'cors',
        body: JSON.stringify(args),
      });
      return response.json();
    },

    getAllPages() {
      return this.query({ query: GET_ALL_PAGES });
    },

    getPageById(contentId) {
      return this.query({
        query: GET_PAGE_BY_ID,
        variables: { path: contentId },
      });
    },
  };
}

module.exports = getDrupalClient;
