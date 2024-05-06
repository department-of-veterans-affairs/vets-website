const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvLandingPagePersonalization = true,
    mhvLandingPageEnableVaGovHealthToolsLinks = true,
    mhvTransitionalMedicalRecordsLandingPage = true,
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
          name: 'mhv_landing_page_enable_va_gov_health_tools_links',
          value: mhvLandingPageEnableVaGovHealthToolsLinks,
        },
        {
          name: 'mhv_transitional_medical_records_landing_page',
          value: mhvTransitionalMedicalRecordsLandingPage,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
