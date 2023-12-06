const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvMedicationsToVaGovRelease = true,
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
          name: 'mhv_medications_to_va_gov_release',
          value: mhvMedicationsToVaGovRelease,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
