const generateFeatureToggles = (toggles = {}) => {
  const { findARepresentativeEnableFrontend = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'find_a_representative_enable_frontend',
          value: findARepresentativeEnableFrontend,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
