const moment = require('moment');

const fetch = require('node-fetch');

const GET_ALL_PAGES = require('./graphql/GetAllPages.graphql');
const GET_PAGE_BY_ID = require('./graphql/GetPageById.graphql');
const GET_LATEST_PAGE_BY_ID = require('./graphql/GetLatestPageById.graphql');

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
    getSiteUri() {
      return address;
    },

    async query(args) {
      const response = await fetch(drupalUri, {
        headers,
        method: 'post',
        mode: 'cors',
        body: JSON.stringify(args),
      });

      if (response.ok) {
        return response.json();
      }

      throw new Error(`HTTP error: ${response.status}: ${response.statusText}`);
    },

    getAllPages() {
      return this.query({
        query: GET_ALL_PAGES,
        variables: { today: moment().format('YYYY-MM-DD') },
      });
    },

    getPageById(url) {
      return this.query({
        query: GET_PAGE_BY_ID,
        variables: { path: url, today: moment().format('YYYY-MM-DD') },
      });
    },

    getLatestPageById(nodeId) {
      return this.query({
        query: GET_LATEST_PAGE_BY_ID,
        variables: { id: nodeId, today: moment().format('YYYY-MM-DD') },
      });
    },
  };
}

module.exports = getDrupalClient;
