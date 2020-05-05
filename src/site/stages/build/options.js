/* eslint-disable no-param-reassign */

const path = require('path');
const fs = require('fs-extra');
const commandLineArgs = require('command-line-args');

const ENVIRONMENTS = require('../../constants/environments');
const HOSTNAMES = require('../../constants/hostnames');
const assetSources = require('../../constants/assetSources');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

const getDrupalClient = require('./drupal/api');
const { shouldPullDrupal } = require('./drupal/metalsmith-drupal');
const { defaultCMSExportContentDir } = require('./process-cms-exports/helpers');
const { logDrupal } = require('./drupal/utilities-drupal');
const { useFlags } = require('./drupal/load-saved-flags');

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'api', type: String, defaultValue: null },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'asset-source', type: String, defaultValue: assetSources.LOCAL },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'pull-drupal', type: Boolean, defaultValue: false },
  { name: 'use-cms-export', type: Boolean, defaultValue: false },
  { name: 'cms-export-dir', type: String, defaultValue: null },
  { name: 'drupal-fail-fast', type: Boolean, defaultValue: false },
  {
    name: 'drupal-address',
    type: String,
    defaultValue: process.env.DRUPAL_ADDRESS,
  },
  {
    name: 'drupal-user',
    type: String,
    defaultValue: process.env.DRUPAL_USERNAME,
  },
  {
    name: 'drupal-password',
    type: String,
    defaultValue: process.env.DRUPAL_PASSWORD,
  },
  { name: 'no-drupal-proxy', type: Boolean, defaultValue: false },
  { name: 'local-proxy-rewrite', type: Boolean, defaultValue: false },
  { name: 'local-css-sourcemaps', type: Boolean, defaultValue: false },
  { name: 'accessibility', type: Boolean, defaultValue: false },
  { name: 'lint-plain-language', type: Boolean, defaultValue: false },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

function gatherFromCommandLine() {
  const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

  // Set defaults which require the value of other options
  options['cms-export-dir'] =
    options['cms-export-dir'] || defaultCMSExportContentDir(options.buildtype);

  if (options.unexpected && options.unexpected.length !== 0) {
    throw new Error(`Unexpected arguments: '${options.unexpected}'`);
  }

  process.env.buildOptions = options;

  return options;
}

function applyDefaultOptions(options) {
  const contentPagesRoot = options['content-directory'];
  const contentRoot = path.join(contentPagesRoot, '../');

  const projectRoot = path.resolve(__dirname, '../../../../');
  const siteRoot = path.join(__dirname, '../../');
  const includes = path.join(siteRoot, 'includes');
  const components = path.join(siteRoot, 'components');
  const layouts = path.join(siteRoot, 'layouts');
  const paragraphs = path.join(siteRoot, 'paragraphs');
  const navigation = path.join(siteRoot, 'navigation');
  const facilities = path.join(siteRoot, 'facilities');
  const blocks = path.join(siteRoot, 'blocks');
  const teasers = path.join(siteRoot, 'teasers');
  const utilities = path.join(siteRoot, 'utilities');

  Object.assign(options, {
    contentRoot,
    contentPagesRoot,
    contentFragments: path.join(contentRoot, 'fragments'),
    contentAssets: {
      source: path.join(contentRoot, 'assets'),
      destination: './',
    },
    destination: path.resolve(projectRoot, 'build', options.buildtype),
    appAssets: {
      source: '../../assets',
      destination: './',
    },
    layouts,
    collections: require('./data/collections.json'),
    watchPaths: [
      `${contentRoot}/**/*.{md,html,liquid}`,
      `${includes}/**/*.{md,html,liquid}`,
      `${components}/**/*.{md,html,liquid}`,
      `${layouts}/**/*.{md,html,liquid}`,
      `${paragraphs}/**/*.{md,html,liquid}`,
      `${navigation}/**/*.{md,html,liquid}`,
      `${facilities}/**/*.{md,html,liquid}`,
      `${blocks}/**/*.{md,html,liquid}`,
      `${teasers}/**/*.{md,html,liquid}`,
    ],
    cacheDirectory: path.join(projectRoot, '.cache', options.buildtype),
    paramsDirectory: path.join(utilities, 'query-params'),
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

  options.domainReplacements = [
    { from: 'https://www\\.va\\.gov', to: options.hostUrl },
  ];
}

/**
 * Sets up the CMS feature flags by either querying the CMS for them
 * or using ../../utilities/featureFlags. If we pull from Drupal, it'll
 * also ensure the cache directory exists and is empty.
 */
async function setUpFeatureFlags(options) {
  global.buildtype = options.buildtype;
  let rawFlags;

  const featureFlagFile = path.join(
    options.cacheDirectory,
    'drupal',
    'feature-flags.json',
  );

  if (shouldPullDrupal(options)) {
    logDrupal('Pulling feature flags from Drupal...');
    const apiClient = getDrupalClient(options);
    const result = await apiClient.proxyFetch(
      `${apiClient.getSiteUri()}/flags_list`,
    );

    rawFlags = (await result.json()).data;

    // Write them to .cache/{buildtype}/drupal/feature-flags.json
    fs.ensureDirSync(options.cacheDirectory);
    fs.emptyDirSync(path.dirname(featureFlagFile));
    fs.writeJsonSync(featureFlagFile, rawFlags, { spaces: 2 });
  } else {
    logDrupal('Using cached feature flags');
    rawFlags = fs.existsSync(featureFlagFile)
      ? fs.readJsonSync(featureFlagFile)
      : {};
  }

  logDrupal(`Drupal feature flags:\n${JSON.stringify(rawFlags, null, 2)}`);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const proxiedFlags = useFlags(rawFlags);

  Object.assign(options, {
    cmsFeatureFlags: proxiedFlags,
  });
}

async function getOptions(commandLineOptions) {
  const options = commandLineOptions || gatherFromCommandLine();

  applyDefaultOptions(options);
  applyEnvironmentOverrides(options);
  deriveHostUrl(options);
  await setUpFeatureFlags(options);

  return options;
}

module.exports = getOptions;
