/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');
const environments = require('./constants/environments');
const hostnames = require('./constants/hostnames');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: environments.LOCALHOST },
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
}

function deriveHostUrl(options) {
  if (options.buildtype !== environments.LOCALHOST) {
    options.port = 80;
    options.protocol = 'https';
    options.host = hostnames[options.buildtype];

    const isHerokuBuild = !!process.env.HEROKU_APP_NAME;
    if (isHerokuBuild) {
      options.host = `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
    }
  }

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  options.domainReplacements = [{ from: 'www\\.va\\.gov', to: options.host }];
}

function applyEnvironmentOverrides(options) {
  if (options.buildtype === environments.LOCALHOST) return;

  const environment = environments[options.buildtype];

  if (!environment) {
    throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }

  if (environment === environments.VAGOVPROD) {
    process.env.NODE_ENV = 'production';
  }
}

function getOptions() {
  const options = gatherFromCommandLine();

  applyDefaultOptions(options);
  deriveHostUrl(options);
  applyEnvironmentOverrides(options);

  return options;
}

module.exports = getOptions();
