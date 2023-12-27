const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvLandingPagePersonalization = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_landing_page_enabled',
          value: mhvLandingPageEnabled,
        },
        {
          name: 'mhv_landing_page_personalization',
          value: mhvLandingPagePersonalization,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
