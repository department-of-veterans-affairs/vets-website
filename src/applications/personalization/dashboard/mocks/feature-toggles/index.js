const generateFeatureToggles = (toggles = {}) => {
  const {
    profileUseVaosV2Api = true,
    myvaCernerFromDrupal = true,
    showMyVADashboardV2 = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'profile_use_vaos_v2_api',
          value: profileUseVaosV2Api,
        },
        {
          name: 'myva_cerner_from_drupal',
          value: myvaCernerFromDrupal,
        },
        {
          name: 'show_myva_dashboard_2_0',
          value: showMyVADashboardV2,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
