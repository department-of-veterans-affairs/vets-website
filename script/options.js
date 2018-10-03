/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');
const applyHerokuOptions = require('./heroku-helper');
const environments = require('./constants/environments');
const hostnames = require('./constants/hostnames');

const defaultHost = 'localhost';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: environments.DEVELOPMENT },
  { name: 'brand-consolidation-enabled', type: Boolean, defaultValue: false },
  { name: 'no-sanity-check-node-env', type: Boolean, defaultValue: false },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'host', type: String },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },

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
  Object.assign(options, {
    contentRoot: '../content',
    destination: path.resolve(__dirname, `../build/${options.buildtype}`),
    assets: {
      source: '../assets',
      destination: './',
    },
    collections: require('./collections/default.json'),
    redirects: [],
  });

  if (options.buildtype === undefined) {
    options.buildtype = environments.DEVELOPMENT;
  }
}

function applyEnvironmentOverrides(options) {
  const env = require('get-env')();

  // priority order: command line option, watch task host (localhost), build type host, default host
  if (!options.host) {
    if (!options.watch && options.buildtype) {
      options.host = hostnames[options.buildtype];
    } else {
      options.host = defaultHost;
    }
  }

  switch (options.buildtype) {
    case environments.DEVELOPMENT:
    case environments.STAGING:
      break;

    case environments.PRODUCTION:
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
      options['brand-consolidation-enabled'] = true;
      break;

    default:
      throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }
}

function applyBrandConsolidationOverrides(options) {
  let currentEnv = 'dev';
  if (
    options.buildtype.includes(environments.STAGING) ||
    options.buildtype === environments.PREVIEW
  ) {
    currentEnv = 'staging';
  }

  // This list also exists in stagingDomains.js
  const domainReplacements = [
    { from: 'www\\.va\\.gov', to: `${currentEnv}.va.gov` },
  ];

  Object.assign(options, {
    contentRoot: '../va-gov',
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
