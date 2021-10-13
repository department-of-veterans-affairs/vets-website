const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    checkInExperienceMultipleAppointmentSupport = true,
    checkInExperienceUpdateInformationPageEnabled = false,
    checkInExperienceDemographicsPageEnabled = false,
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
          name: 'check_in_experience_multiple_appointment_support',
          value: checkInExperienceMultipleAppointmentSupport,
        },
        {
          name: 'check_in_experience_demographics_page_enabled',
          value: checkInExperienceDemographicsPageEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
