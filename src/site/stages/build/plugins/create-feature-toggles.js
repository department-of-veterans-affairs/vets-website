// const fs = require('fs-extra');
// const path = require('path');
// const yaml = require('js-yaml');

// const footerData = require('../../../../platform/static-data/footer-links.json');

// const { applyFragments } = require('./apply-fragments');

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

// look at build options
// extra fetching from flipper client into module that can be required (isomoprhic feature toggle fetch)

module.exports = createFeatureToggles;
