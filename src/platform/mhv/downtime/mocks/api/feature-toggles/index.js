const generateFeatureToggles = (toggles = {}) => {
  const { mhvLandingPagePersonalization = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_landing_page_personalization',
          value: mhvLandingPagePersonalization,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
