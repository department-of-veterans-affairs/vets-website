const moment = require('moment');
const fetch = require('node-fetch');
const SocksProxyAgent = require('socks-proxy-agent');

const DRUPALS = require('../../../constants/drupals');
const { queries, getQuery } = require('./queries');

const syswidecas = require('syswide-cas');

function encodeCredentials({ user, password }) {
  const credentials = `${user}:${password}`;
  const credentialsEncoded = Buffer.from(credentials).toString('base64');
  return credentialsEncoded;
}

function getDrupalClient(buildOptions) {
  const buildArgs = {
    address: buildOptions['drupal-address'],
    user: buildOptions['drupal-user'],
    password: buildOptions['drupal-password'],
  };

  Object.keys(buildArgs).forEach(key => {
    if (!buildArgs[key]) delete buildArgs[key];
  });

  const envConfig = DRUPALS[buildOptions.buildtype];
  const drupalConfig = Object.assign({}, envConfig, buildArgs);

  const { address, user, password } = drupalConfig;
  const drupalUri = `${address}/graphql`;
  const encodedCredentials = encodeCredentials({ user, password });
  const headers = {
    Authorization: `Basic ${encodedCredentials}`,
    'Content-Type': 'application/json',
  };
  const agent = new SocksProxyAgent('socks://127.0.0.1:2001');

  return {
    // We have to point to aws urls on Jenkins, so the only
    // time we'll be using cms.va.gov addresses is locally,
    // when we need a proxy
    usingProxy:
      address.includes('cms.va.gov') && !buildOptions['no-drupal-proxy'],

    getSiteUri() {
      return address;
    },

    async proxyFetch(url, options = {}) {
      if (this.usingProxy) {
        // addCAs() is here because VA uses self-signed certificates with a
        // non-globally trusted Root Certificate Authority and we need to
        // tell our code to trust it, otherwise we get self-signed certificate errors.
        syswidecas.addCAs('certs/VA-Internal-S2-RCA1-v1.pem');
      }

      return fetch(
        url,
        Object.assign({}, options, {
          agent: this.usingProxy ? agent : undefined,
        }),
      );
    },

    async query(args) {
      const response = await this.proxyFetch(drupalUri, {
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

    getAllPages(onlyPublishedContent = true) {
      return this.query({
        query: getQuery(queries.GET_ALL_PAGES),
        variables: {
          today: moment().format('YYYY-MM-DD'),
          onlyPublishedContent,
        },
      });
    },

    getLatestPageById(nodeId) {
      return this.query({
        query: getQuery(queries.GET_LATEST_PAGE_BY_ID),
        variables: {
          id: nodeId,
          today: moment().format('YYYY-MM-DD'),
          onlyPublishedContent: false,
        },
      });
    },
  };
}

module.exports = getDrupalClient;
