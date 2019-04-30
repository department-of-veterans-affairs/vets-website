const fs = require('fs');
const path = require('path');

// Edit this to add new flags
const featureFlags = {
  FEATURE1: 'feature1',
};

// Edit this to turn flags on or off
const flagsByBuildtype = {
  // localhost: [],
  localhost: [featureFlags.FEATURE1],
  // vagovdev: [flags.FEATURE1],
  vagovdev: [],
  // vagovstaging: [flags.FEATURE1],
  vagovstaging: [],
  // vagovprod: [flags.FEATURE1],
  vagovprod: [],
};

// Exported feature flag state, which can be used in code as needed
const enabledFeatureFlags = Object.values(featureFlags).reduce((acc, next) => {
  acc[next] = flagsByBuildtype[global.buildtype].includes(next);
  return acc;
}, {});

// For requiring queries
const requireWithFeatureFlag = (dirname, filePath) => {
  if (!dirname || !filePath) {
    throw new Error(
      'Both the directory name and the file path are required when using requireWithFeatureFlag',
    );
  }

  let flaggedPath = filePath;
  Object.keys(enabledFeatureFlags)
    .filter(flag => enabledFeatureFlags[flag])
    .forEach(flag => {
      // Would need some logic to handle with and without .js
      let pathToTest = `${filePath}.${flag}.js`;
      if (filePath.endsWith('.js')) {
        pathToTest = filePath.replace('.js', `.${flag}.js`);
      }

      if (fs.existsSync(path.join(dirname, pathToTest))) {
        flaggedPath = pathToTest;
      }
    });

  // eslint-disable-next-line import/no-dynamic-require
  return require(path.join(dirname, flaggedPath));
};

Object.defineProperty(global, 'requireWithFeatureFlag', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: requireWithFeatureFlag,
});

module.exports = {
  enabledFeatureFlags,
  featureFlags,
};
