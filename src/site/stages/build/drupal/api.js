const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');
const fetch = require('node-fetch');
const chalk = require('chalk');
const SocksProxyAgent = require('socks-proxy-agent');

const DRUPALS = require('../../../constants/drupals');
const { queries, getQuery } = require('./queries');

const syswidecas = require('syswide-cas');

const {
  getContentDir,
  readAllNodeNames,
  readEntity,
} = require('../process-cms-exports/helpers');
const entityTreeFactory = require('../process-cms-exports');

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
  const contentExportUri = `${address}/cms-export/content`;
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
        return response.text().then(data => {
          try {
            return JSON.parse(data);
          } catch (error) {
            /* eslint-disable no-console */
            console.error(
              chalk.red(
                "There was an error parsing the response body, it isn't valid JSON. Here is the error:",
              ),
            );
            console.error(error);
            console.error();
            console.error(chalk.red('Response code:'), response.status);
            console.error(chalk.red('Start of body:'), data.slice(0, 100));
            console.error(chalk.red('End of body:'), data.slice(-100));
            /* eslint-enable */

            throw error;
          }
        });
      }

      throw new Error(`HTTP error: ${response.status}: ${response.statusText}`);
    },

    /**
     * Fetches and untars the CMS export.
     *
     * @return {String} - The path to the untarred CMS export.
     */
    async fetchExportContent({ log } = { log: true }) {
      /* eslint-disable no-console */
      const say = log ? console.log : () => {};

      // Assumes the buildtype is in the cms-export-dir path to avoid naming collision
      const contentParentPath = path.join(buildOptions['cms-export-dir'], '..');
      const pathToContentTar = path.join(contentParentPath, `content.tar`);
      const fileStream = fs.createWriteStream(pathToContentTar);

      say(
        chalk.green('Fetching content export from'),
        chalk.blue.underline(contentExportUri),
      );

      const timer = `${chalk.blue(contentExportUri)} reponse time`;
      console.time(timer);

      const response = await this.proxyFetch(contentExportUri);

      say('Status code:', response.status);

      if (response.ok) {
        say(`Writing file to ${chalk.blue(pathToContentTar)}`);
        await new Promise(resolve => {
          response.body.pipe(fileStream);
          response.body.on('end', () => {
            console.timeEnd(timer);
            process.exit(0);
            resolve();
          });
        });
        // TODO: Untar it
      } else {
        throw new Error('Failed to fetch the CMS export tarball');
      }
      /* eslint-enable no-console */
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

    getNonNodeContent(onlyPublishedContent = true) {
      return this.query({
        query: getQuery(queries.GET_ALL_PAGES, { useTomeSync: true }),
        variables: {
          onlyPublishedContent,
        },
      });
    },

    getExportedPages() {
      const exportDir = buildOptions['cms-export-dir'];
      const entities = readAllNodeNames(exportDir).map(entityDetails =>
        readEntity(exportDir, ...entityDetails),
      );
      const assembleEntityTree = entityTreeFactory(getContentDir(exportDir));

      const modifiedEntities = entities.map(entity =>
        assembleEntityTree(entity),
      );

      return modifiedEntities;
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
