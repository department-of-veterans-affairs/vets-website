/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');
const environments = require('./constants/environments');
const hostnames = require('./constants/hostnames');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: environments.LOCALHOST },
  { name: 'no-sanity-check-node-env', type: Boolean, defaultValue: false },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'host', type: String, defaultValue: 'localhost' },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-deployment', type: Boolean, defaultValue: false },
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
  const isHerokuBuild = !!process.env.HEROKU_APP_NAME;

  Object.assign(options, {
    contentRoot: '../va-gov',
    contentPagesRoot: options['content-directory'],
    contentFragments: path.join(options['content-directory'], '../fragments'),
    contentAssets: {
      source: path.join(options['content-directory'], '../assets'),
      destination: './',
    },
    destination: path.resolve(__dirname, `../build/${options.buildtype}`),
    appAssets: {
      source: '../assets',
      destination: './',
    },
    collections: require('./collections/default.json'),
    redirects: require('./vagovRedirects.json'),
  });

  // Derive the complete host URL
  if (options.buildtype === environments.LOCALHOST) {
    options.buildtype = environments.DEVELOPMENT;
  } else {
    options.port = 80;
    options.protocol = 'https';
    options.host = hostnames[options.buildtype];
  }

  if (isHerokuBuild) {
    options.port = 80;
    options.protocol = 'https';
    options.host = `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  }

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  // This list also exists in stagingDomains.js
  const domainReplacements = [{ from: 'www\\.va\\.gov', to: options.host }];
  Object.assign(options, { domainReplacements });
}

function applyEnvironmentOverrides(options) {
  const nodeEnv = process.env.NODE_ENV;

  switch (options.buildtype) {
    case environments.VAGOVDEV:
    case environments.VAGOVSTAGING:
    case environments.PREVIEW:
      break;

    case environments.VAGOVPROD:
      if (nodeEnv !== 'production') {
        throw new Error(
          `buildtype ${
            options.buildtype
          } expects NODE_ENV to be production, not '${nodeEnv}'`,
        );
      }
      break;

    default:
      throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }
}

function getOptions() {
  const options = gatherFromCommandLine();

  applyDefaultOptions(options);
  applyEnvironmentOverrides(options);

  return options;
}

module.exports = getOptions();
