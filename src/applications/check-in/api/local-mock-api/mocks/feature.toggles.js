const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    checkInExperienceLowAuthenticationEnabled = true,
    checkInExperienceMultipleAppointmentSupport = true,
    checkInExperienceUpdateInformationPageEnabled = false,
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
          name: 'check_in_experience_low_authentication_enabled',
          value: checkInExperienceLowAuthenticationEnabled,
        },
        {
          name: 'check_in_experience_multiple_appointment_support',
          value: checkInExperienceMultipleAppointmentSupport,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
