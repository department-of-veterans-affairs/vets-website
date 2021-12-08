const generateFeatureToggles = (toggles = {}) => {
  const { preCheckInEnabled = true, emergencyContactEnabled = false } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'check_in_experience_pre_check_in_enabled',
          value: preCheckInEnabled,
        },
        {
          name: 'check_in_experience_emergency_contact_enabled',
          value: emergencyContactEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
