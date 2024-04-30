const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPageEnabled = true,
    mhvLandingPagePersonalization = true,
    mhvLandingPageEnableVaGovHealthToolsLinks = true,
    mhvSecondaryNavigationEnabled = true,
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
          name: 'mhv_secondary_navigation_enabled',
          value: mhvSecondaryNavigationEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
