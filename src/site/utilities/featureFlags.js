const fs = require('fs');
const path = require('path');

// Edit this to add new flags
const featureFlags = {
  // FEATURE1: 'feature1',
};

// Edit this to turn flags on or off
const flagsByBuildtype = {
  // localhost: [featureFlags.FEATURE1],
  localhost: [],
  // vagovdev: [featureFlags.FEATURE1],
  vagovdev: [],
  // vagovstaging: [featureFlags.FEATURE1],
  vagovstaging: [],
  // vagovprod: [featureFlags.FEATURE1],
  vagovprod: [],
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
