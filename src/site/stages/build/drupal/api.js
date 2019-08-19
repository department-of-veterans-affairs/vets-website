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
    useProxy: buildOptions['use-proxy']
  };

  Object.keys(buildArgs).forEach(key => {
    if (!buildArgs[key]) delete buildArgs[key];
  });

  const envConfig = DRUPALS[buildOptions.buildtype];
  const drupalConfig = Object.assign({}, envConfig, buildArgs);

  const { address, user, password, useProxy } = drupalConfig;
  const drupalUri = `${address}/graphql`;
  const encodedCredentials = encodeCredentials({ user, password });
  const headers = {
    Authorization: `Basic ${encodedCredentials}`,
    'Content-Type': 'application/json',
  };
  const agent = new SocksProxyAgent('socks://127.0.0.1:2001');

  return {
    // During Production WEB builds, the WEB build process reads from the Drupal
    // CMS using the AWS ELB URL.
    // e.g. internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com

    // When running WEB build process, the site at DRUPAL_ADDRESS must be reachable.
    // If building and sourcing content from a site at *.cms.va.gov, from outside of VAEC,
    // the socks proxy agent must be used because those sites are in VAEC.

    // If a CMS is available at DRUPAL_ADDRESS, reachable by the WEB build process, the proxy is not needed.
    // This includes in local development environment where user has a local CMS instance
    // and when WEB is built in CMS-CI where every WEB has a CMS instance.

    // These are the two situations where the proxy must not be used.
    //
    // If use-proxy is null we dynamically detect it here.
    usingProxy: useProxy,

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
