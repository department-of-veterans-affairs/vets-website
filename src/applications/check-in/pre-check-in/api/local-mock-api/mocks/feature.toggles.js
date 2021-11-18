const generateFeatureToggles = (toggles = {}) => {
  const { preCheckInEnabled = true } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'check_in_experience_pre_check_in_enabled',
          value: preCheckInEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
