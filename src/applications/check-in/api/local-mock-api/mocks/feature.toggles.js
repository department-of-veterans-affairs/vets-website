const createFeatureToggles = (
  checkInExperienceEnabled = true,
  checkInExperienceLowAuthenticationEnabled = false,
  checkInExperienceMultipleAppointmentSupport = false,
) => {
  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'check_in_experience_enabled',
          value: checkInExperienceEnabled,
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

module.exports = { createFeatureToggles };
