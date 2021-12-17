const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    checkInExperienceUpdateInformationPageEnabled = false,
    emergencyContactEnabled = false,
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
          name: 'check_in_experience_update_information_page_enabled',
          value: checkInExperienceUpdateInformationPageEnabled,
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
