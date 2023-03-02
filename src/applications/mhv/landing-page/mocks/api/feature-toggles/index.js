const generateFeatureToggles = (toggles = {}) => {
  const { mhvLandingPageEnabled = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_landing_page_enabled',
          value: mhvLandingPageEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
