const { snakeCase } = require('lodash');

const generateFeatureToggles = (toggles = {}) => {
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

module.exports = { generateFeatureToggles };
