const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    preCheckInEnabled = true,
    checkInExperienceUpdateInformationPageEnabled = false,
    emergencyContactEnabled = false,
    showPaymentAndDebtSection = false,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'check_in_experience_enabled',
          value: checkInExperienceEnabled,
        },
        {
          name: 'check_in_experience_pre_check_in_enabled',
          value: preCheckInEnabled,
        },
        {
          name: 'check_in_experience_update_information_page_enabled',
          value: checkInExperienceUpdateInformationPageEnabled,
        },

        {
          name: 'check_in_experience_emergency_contact_enabled',
          value: emergencyContactEnabled,
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
