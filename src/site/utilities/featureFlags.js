const fs = require('fs');
const path = require('path');

// Edit this to add new flags
const featureFlags = {
  FEATURE_FIELD_REGIONAL_HEALTH_SERVICE: 'featureFieldRegionalHealthService',
  GRAPHQL_MODULE_UPDATE: 'featureGraphQLModuleUpdate',
  FEATURE_FIELD_OTHER_VA_LOCATIONS: 'featureFieldOtherVaLocations',
  FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS:
    'featureFieldCommonlyTreatedConditions',
};

// Edit this to turn flags on or off
const flagsByBuildtype = {
  localhost: [
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
  ],
  vagovdev: [
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
    featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS,
  ],
  vagovstaging: [
    featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE,
    featureFlags.GRAPHQL_MODULE_UPDATE,
    featureFlags.FEATURE_FIELD_OTHER_VA_LOCATIONS,
  ],
  vagovprod: [featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE],
};

// Exported feature flag state, which can be used in code as needed
const enabledFeatureFlags = Object.values(featureFlags).reduce((acc, next) => {
  acc[next] = flagsByBuildtype[global.buildtype].includes(next);
  return acc;
}, {});

const applyFeatureFlags = (moduleToFlag, flagToUse = null) => {
  let flaggedPath;
  Object.keys(enabledFeatureFlags)
    .filter(
      flag => enabledFeatureFlags[flag] && (!flagToUse || flagToUse === flag),
    )
    .forEach(flag => {
      const extension = path.extname(moduleToFlag.filename);
      const pathToTest = moduleToFlag.filename.replace(
        extension,
        `.${flag}${extension}`,
      );

      if (fs.existsSync(pathToTest)) {
        flaggedPath = pathToTest;
      }
    });

  if (flaggedPath) {
    // eslint-disable-next-line import/no-dynamic-require,no-param-reassign
    moduleToFlag.exports = require(flaggedPath);
  }
};

Object.defineProperty(global, 'applyFeatureFlags', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: applyFeatureFlags,
});

module.exports = {
  enabledFeatureFlags,
  featureFlags,
};
