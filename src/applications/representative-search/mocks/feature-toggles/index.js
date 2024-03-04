const generateFeatureToggles = (toggles = {}) => {
  const { findARepresentativeEnabled = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'find_a_representative',
          value: findARepresentativeEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
