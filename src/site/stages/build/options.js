/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');

const ENVIRONMENTS = require('../../constants/environments');
const HOSTNAMES = require('../../constants/hostnames');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-deployment', type: Boolean, defaultValue: false },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'local-proxy-rewrite', type: Boolean, defaultValue: false },
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
  const contentPagesRoot = options['content-directory'];
  const contentRoot = path.join(contentPagesRoot, '../');

  Object.assign(options, {
    contentRoot,
    contentPagesRoot,
    contentFragments: path.join(contentRoot, 'fragments'),
    contentAssets: {
      source: path.join(contentRoot, 'assets'),
      destination: './',
    },
    destination: path.resolve(
      __dirname,
      '../../../../build',
      options.buildtype,
    ),
    appAssets: {
      source: '../../assets',
      destination: './',
    },
    layouts: path.join(__dirname, '../../layouts'),
    collections: require('./data/collections.json'),
    redirects: require('./data/vagovRedirects.json'),
  });
}

function applyEnvironmentOverrides(options) {
  if (options.buildtype === ENVIRONMENTS.LOCALHOST) return;

  const allBuildtypes = Object.keys(ENVIRONMENTS).map(key => ENVIRONMENTS[key]);
  const isBuildtypeValid = allBuildtypes.includes(options.buildtype);

  if (!isBuildtypeValid) {
    throw new Error(`Unknown buildtype: '${options.buildtype}'`);
  }

  const optimizedEnvs = new Set([
    ENVIRONMENTS.VAGOVPROD,
    ENVIRONMENTS.VAGOVSTAGING,
  ]);
  const isOptimizedBuild = optimizedEnvs.has(options.buildtype);

  if (isOptimizedBuild && process.env.NODE_ENV !== 'production') {
    throw new Error(
      'To build a production-like environment, the "NODE_ENV" environment variable must be set to "production".',
    );
  }
}

function deriveHostUrl(options) {
  const isHerokuBuild = !!process.env.HEROKU_APP_NAME;

  if (options.buildtype !== ENVIRONMENTS.LOCALHOST || isHerokuBuild) {
    options.port = 80;
    options.protocol = 'https';

    if (isHerokuBuild) {
      options.host = `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
    } else {
      options.host = HOSTNAMES[options.buildtype];
    }
  }

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  options.domainReplacements = [{ from: 'www\\.va\\.gov', to: options.host }];
}

function getOptions(commandLineOptions) {
  const options = commandLineOptions || gatherFromCommandLine();

  applyDefaultOptions(options);
  applyEnvironmentOverrides(options);
  deriveHostUrl(options);

  return options;
}

module.exports = getOptions;
