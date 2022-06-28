const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    preCheckInEnabled = true,
    checkInExperienceEditingDayOfEnabled = false,
    checkInExperienceEditingPreCheckInEnabled = false,
    checkInExperienceTranslationDayOfEnabled = true,
    checkInExperienceTranslationPreCheckInEnabled = true,
    checkInExperienceTranslationDisclaimerSpanishEnabled = true,
    checkInExperienceDayOfDemographicsFlagsEnabled = true,
    checkInExperienceLorotaSecurityUpdatesEnabled = false,
    checkInExperienceEditMessagingEnabled = false,
    checkInExperiencePhoneAppointmentsEnabled = false,
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
          name: 'check_in_experience_editing_day_of_enabled',
          value: checkInExperienceEditingDayOfEnabled,
        },
        {
          name: 'check_in_experience_editing_pre_check_in_enabled',
          value: checkInExperienceEditingPreCheckInEnabled,
        },
        {
          name: 'check_in_experience_translation_day_of_enabled',
          value: checkInExperienceTranslationDayOfEnabled,
        },
        {
          name: 'check_in_experience_translation_pre_check_in_enabled',
          value: checkInExperienceTranslationPreCheckInEnabled,
        },
        {
          name: 'check_in_experience_translation_disclaimer_spanish_enabled',
          value: checkInExperienceTranslationDisclaimerSpanishEnabled,
        },
        {
          name: 'check_in_experience_day_of_demographics_flags_enabled',
          value: checkInExperienceDayOfDemographicsFlagsEnabled,
        },
        {
          name: 'check_in_experience_lorota_security_updates_enabled',
          value: checkInExperienceLorotaSecurityUpdatesEnabled,
        },
        {
          name: 'check_in_experience_edit_messaging_enabled',
          value: checkInExperienceEditMessagingEnabled,
        },
        {
          name: 'check_in_experience_phone_appointments_enabled',
          value: checkInExperiencePhoneAppointmentsEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
