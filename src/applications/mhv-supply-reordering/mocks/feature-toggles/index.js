const { snakeCase } = require('lodash');

const APPLICATION_FEATURE_TOGGLES = Object.freeze({
  mhvVaHealthChatEnabled: false,
  mhvLandingPagePersonalization: false,
  travelPayPowerSwitch: false,
  mhvSupplyReorderingEnabled: true,
});

const generateFeatureToggles = ({
  toggles = APPLICATION_FEATURE_TOGGLES,
} = {}) => {
  const snakeCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: key,
    value,
  }));

  const camelCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: snakeCase(key),
    value,
  }));

  return {
    data: {
      type: 'feature_toggles',
      features: [...snakeCaseToggles, ...camelCaseToggles],
    },
  };
};

module.exports = {
  '/v0/feature_toggles': generateFeatureToggles(),
};
