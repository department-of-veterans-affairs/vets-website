const generateFeatureToggles = (toggles = {}) => {
  const { findARepresentativeEnableFrontEnd = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'find_a_representative_enable_frontend',
          value: findARepresentativeEnableFrontEnd,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
