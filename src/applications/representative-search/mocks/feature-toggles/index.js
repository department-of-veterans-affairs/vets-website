const generateFeatureToggles = (toggles = {}) => {
  const { findARepresentative = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'find_a_representative',
          value: findARepresentative,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
