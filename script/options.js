/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');
const applyHerokuOptions = require('./heroku-helper');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: 'development' },
  { name: 'brand-consolidation-enabled', type: Boolean, defaultValue: false },
  { name: 'no-sanity-check-node-env', type: Boolean, defaultValue: false },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'host', type: String, defaultValue: 'localhost' },
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
      source: '../assets', destination: './'
    },
    collections: require('./collections/default.json')
  });

  if (options.buildtype === undefined) {
    options.buildtype = 'development';
  }
}

function applyEnvironmentOverrides(options) {
  const env = require('get-env')();

  switch (options.buildtype) {
    case 'development':
    // No extra checks needed in dev.
      break;

    case 'staging':
      break;

    case 'production':
      if (options['no-sanity-check-node-env'] === false) {
        if (env !== 'prod') {
          throw new Error(`buildtype ${options.buildtype} expects NODE_ENV to be production, not '${process.env.NODE_ENV}'`);
        }
      }
      break;

    case 'devpreview':
    case 'preview':
      options['brand-consolidation-enabled'] = true;
      break;

    default:
      throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }
}

function applyBrandConsolidationOverrides(options) {
  Object.assign(options, {
    contentRoot: '../va-gov',
    collections: require('./collections/brand-consolidation.json')
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
