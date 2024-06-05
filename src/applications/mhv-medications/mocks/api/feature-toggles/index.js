const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvLandingPagePersonalization = true,
    mhvMedicationsToVaGovRelease = true,
    mhvMedicationsDisplayRefillContent = true,
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
        {
          name: 'mhv_medications_to_va_gov_release',
          value: mhvMedicationsToVaGovRelease,
        },
        {
          name: 'mhv_medications_display_refill_content',
          value: mhvMedicationsDisplayRefillContent,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
