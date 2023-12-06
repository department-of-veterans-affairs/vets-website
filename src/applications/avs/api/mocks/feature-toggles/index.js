const generateFeatureToggles = (toggles = {}) => {
  const { avsEnabled = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'avs_enabled',
          value: avsEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
