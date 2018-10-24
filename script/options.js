/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');
const applyHerokuOptions = require('./heroku-helper');
const environments = require('./constants/environments');
const hostnames = require('./constants/hostnames');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: environments.LOCALHOST },
  { name: 'brand-consolidation-enabled', type: Boolean, defaultValue: false },
  { name: 'no-sanity-check-node-env', type: Boolean, defaultValue: false },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'host', type: String, defaultValue: 'localhost' },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  {
    name: 'content-directory',
    type: String,
    defaultValue: '../../vagov-content/pages',
  },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

function gatherFromCommandLine() {
  const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

  if (options.unexpected && options.unexpected.length !== 0) {
    throw new Error(`Unexpected arguments: '${options.unexpected}'`);
  }

  return options;
}

function applyDefaultOptions(options) {
  const contentRoot = '../content';

  Object.assign(options, {
    contentRoot,
    contentPagesRoot: `${contentRoot}/pages`,
    destination: path.resolve(__dirname, `../build/${options.buildtype}`),
    assets: {
      source: '../assets',
      destination: './',
    },
    collections: require('./collections/default.json'),
    redirects: [],
  });

  if (options.buildtype === environments.LOCALHOST) {
    options.buildtype = environments.DEVELOPMENT;
  } else {
    options.port = 80;
    options.protocol = 'https';
    options.host = hostnames[options.buildtype];
  }

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;
}

function applyEnvironmentOverrides(options) {
  const env = require('get-env')();

  switch (options.buildtype) {
    case environments.DEVELOPMENT:
    case environments.STAGING:
      options.move = [{ source: 'vets-robots.txt', target: 'robots.txt' }];
      options.remove = ['va-robots.txt'];
      break;

    case environments.PRODUCTION:
      options.move = [{ source: 'vets-robots.txt', target: 'robots.txt' }];
      options.remove = ['va-robots.txt'];

      if (options['no-sanity-check-node-env'] === false) {
        if (env !== 'prod') {
          throw new Error(
            `buildtype ${
              options.buildtype
            } expects NODE_ENV to be production, not '${process.env.NODE_ENV}'`,
          );
        }
      }
      break;

    case environments.VAGOVDEV:
    case environments.VAGOVSTAGING:
    case environments.PREVIEW:
      options.move = [{ source: 'va-robots.txt', target: 'robots.txt' }];
      options.remove = ['vets-robots.txt'];

      options['brand-consolidation-enabled'] = true;
      break;

    default:
      throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }
}

function applyBrandConsolidationOverrides(options) {
  // This list also exists in stagingDomains.js
  const domainReplacements = [{ from: 'www\\.va\\.gov', to: options.host }];

  Object.assign(options, {
    contentRoot: '../va-gov',
    contentPagesRoot: options['content-directory'],
    collections: require('./collections/brand-consolidation.json'),
    redirects: require('./vagovRedirects.json'),
    domainReplacements,
  });
}

function getOptions() {
  const options = gatherFromCommandLine();

  applyDefaultOptions(options);

  const isHerokuBuild = !!process.env.HEROKU_APP_NAME;
  if (isHerokuBuild) applyHerokuOptions(options);

  applyEnvironmentOverrides(options);

  const isBrandConsolidationBuild = options['brand-consolidation-enabled'];
  if (isBrandConsolidationBuild) applyBrandConsolidationOverrides(options);

  return options;
}

module.exports = getOptions();
