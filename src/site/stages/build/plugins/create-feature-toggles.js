const {
  FlipperClient,
} = require('../../../../platform/utilities/feature-toggles/flipper-client.js');
const environmentsConfigs = require('../../../constants/environments-configs');
const environments = require('../../../constants/environments');

function createFeatureToggles(buildOptions) {
  const environmentName = buildOptions.buildtype;

  return async (files, metalsmith, done) => {
    const { fetchToggleValues } = FlipperClient({
      host: environmentsConfigs[environmentName].API_URL,
    });

    let toggleValues;
    try {
      toggleValues = await fetchToggleValues();
    } catch (error) {
      // prevents build process from breaking if not running locally
      if (environmentName === environments.LOCALHOST) {
        toggleValues = {};
      } else {
        const errorMessage = `createFeatureToggles failed: ${error.message}`;
        throw new Error(errorMessage);
      }
    }

    Object.keys(files).forEach(file => {
      // eslint-disable-next-line no-param-reassign
      files[file].featureToggles = JSON.stringify(toggleValues);
    });

    done();
  };
}

module.exports = createFeatureToggles;
