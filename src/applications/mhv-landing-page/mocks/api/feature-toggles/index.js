const { snakeCase } = require('lodash');

// Please, keep these feature toggle settings up-to-date with production's feature toggles settings.
const APPLICATION_FEATURE_TOGGLES = Object.freeze({
  mhvVaHealthChatEnabled: true,
  mhvLandingPagePersonalization: true,
  mhvMilestone2ChangesEnabled: true,
  mhvEmailConfirmation: true,
  travelPayPowerSwitch: true,
});

const generateFeatureToggles = ({
  toggles = APPLICATION_FEATURE_TOGGLES,
  enableAll = false,
  disableAll = false,
} = {}) => {
  let overrideValue;
  if (enableAll) overrideValue = true;
  if (disableAll) overrideValue = false;

  const override = enableAll || disableAll;

  const snakeCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: key,
    value: override ? overrideValue : value,
  }));

  const camelCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: snakeCase(key),
    value: override ? overrideValue : value,
  }));

  return {
    data: {
      type: 'feature_toggles',
      features: [...snakeCaseToggles, ...camelCaseToggles],
    },
  };
};

module.exports = { generateFeatureToggles };
