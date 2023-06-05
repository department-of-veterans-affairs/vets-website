const generateFeatureToggles = (toggles = {}) => {
  const {
    myVaUseExperimental = true,
    showMyVADashboardV2 = true,
    showPaymentAndDebtSection = true,
  } = toggles;

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
        {
          name: 'show_payment_and_debt_section',
          value: showPaymentAndDebtSection,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
