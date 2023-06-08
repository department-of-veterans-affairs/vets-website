const generateFeatureToggles = (toggles = {}) => {
  const { myVaUseExperimental = true, showMyVADashboardV2 = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'my_va_experimental',
          value: myVaUseExperimental,
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
