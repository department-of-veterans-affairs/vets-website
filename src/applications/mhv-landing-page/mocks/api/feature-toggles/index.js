const { snakeCase } = require('lodash');
const { APPLICATION_FEATURE_TOGGLES } = require('../../../constants');

const generateFeatureToggles = ({
  toggles = APPLICATION_FEATURE_TOGGLES,
  enableAll = false,
  disableAll = false,
} = {}) => {
  let defaultValue;
  if (enableAll) defaultValue = true;
  if (disableAll) defaultValue = false;

  const overrideValue = enableAll || disableAll;

  const snakeCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: key,
    value: overrideValue ? defaultValue : value,
  }));

  const camelCaseToggles = Object.entries(toggles).map(([key, value]) => ({
    name: snakeCase(key),
    value: overrideValue ? defaultValue : value,
  }));

  return {
    data: {
      type: 'feature_toggles',
      features: [...snakeCaseToggles, ...camelCaseToggles],
    },
  };
};

module.exports = { generateFeatureToggles };
