/* eslint-disable no-param-reassign */

const path = require('path');
const commandLineArgs = require('command-line-args');

const ENVIRONMENTS = require('../../constants/environments');
const HOSTNAMES = require('../../constants/hostnames');
const assetSources = require('../../constants/assetSources');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

// const getDrupalClient = require('./drupal/api');
const { drupalEnabled } = require('./drupal/metalsmith-drupal');

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
  { name: 'local-proxy-rewrite', type: Boolean, defaultValue: false },
  { name: 'local-css-sourcemaps', type: Boolean, defaultValue: false },
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
    redirects: require('./data/vagovRedirects.json'),
    watchPaths: {
      [`${contentRoot}/**/*`]: '**/*.{md,html}',
      [`${includes}/**/*`]: '**/*.{md,html}',
      [`${components}/**/*`]: '**/*.{md,html}',
      [`${layouts}/**/*`]: '**/*.{md,html}',
      [`${paragraphs}/**/*`]: '**/*.{md,html}',
      [`${navigation}/**/*`]: '**/*.{md,html}',
      [`${facilities}/**/*`]: '**/*.{md,html}',
      [`${blocks}/**/*`]: '**/*.{md,html}',
      [`${teasers}/**/*`]: '**/*.{md,html}',
    },
    cacheDirectory: path.join(projectRoot, '.cache', options.buildtype),
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

// Sets up the CMS feature flags by either querying the CMS for them
// or using ../../utilities/featureFlags
async function setUpFeatureFlags(options) {
  global.buildtype = options.buildtype;
  let enabled;

  if (drupalEnabled(options.buildtype)) {
    // Query CMS (will be async...)
    const queryResult = {
      data: {
        FEATURE_FIELD_ASSET_LIBRARY_DESCRIPTION: true,
        FEATURE_FIELD_EVENT_LISTING_DESCRIPTION: false,
        FEATURE_FIELD_BODY: true,
        FEATURE_FIELD_ADDITIONAL_INFO: true, // Errors out when false :grimacing:
        FEATURE_FIELD_REGIONAL_HEALTH_SERVICE: true,
        GRAPHQL_MODULE_UPDATE: true,
        FEATURE_FIELD_OTHER_VA_LOCATIONS: true,
        FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT: false,
        FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS: true,
        FEATURE_FIELD_LINKS: true,
        FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT: false,
        FEATURE_LOCAL_FACILITY_GET_IN_TOUCH: true,
        FEATURE_FIELD_ALERT_DISMISSABLE: true,
        FEATURE_DOWNLOADABLE_FILE: true,
        FEATURE_REGION_PAGE_LINKS: true,
        FEATURE_FIELD_OPERATING_STATUS_FACILITY: true,
        FEATURE_FEATURED_HEALTH_SERVICE_CONTENT: true,
        FEATURE_HEALTH_SERVICE_API_ID: true,
        FEATURE_REGION_DETAIL_PAGE_TOC: true,
        FEATURE_FIELD_COMPLETE_BIOGRAPHY: true,
      },
      method: 'GET',
    };

    // console.log('build options before fetching:', options);
    // const apiClient = getDrupalClient(options);
    // const result = await apiClient.proxyFetch(
    //   `${options['drupal-address']}/flags_list`,
    // );
    // console.log('Fetch results:', result);

    // Using a Proxy to throw an error during the build if the feature
    // flag referenced isn't returned from Drupal.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    const p = new Proxy(queryResult.data, {
      get(obj, prop) {
        if (prop in obj) {
          return obj[prop];
        }
        // Not sure where this was getting called, but V8 does some
        // complicated things under the hood
        // https://www.mattzeunert.com/2016/07/20/proxy-symbol-tostring.html
        const ignoreList = ['Symbol(Symbol.toStringTag)'];
        if (!ignoreList.includes(prop.toString())) {
          throw new ReferenceError(
            `Could not find feature flag ${prop.toString()}. This could be a typo or the feature flag wasn't returned from Drupal.`,
          );
        }

        // If we get this far, I guess we make sure we don't mess up
        // the expected behavior
        return obj[prop];
      },
    });
    enabled = p;
  } else {
    const { cmsFeatureFlags } = require('../../utilities/featureFlags');
    enabled = cmsFeatureFlags;
  }

  Object.assign(options, {
    cmsFeatureFlags: enabled,
  });
  global.cmsFeatureFlags = enabled;
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
