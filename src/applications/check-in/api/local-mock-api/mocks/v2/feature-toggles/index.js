const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    preCheckInEnabled = true,
    checkInExperienceTranslationDisclaimerSpanishEnabled = true,
    checkInExperienceDayOfDemographicsFlagsEnabled = true,
    checkInExperienceLorotaSecurityUpdatesEnabled = true,
    checkInExperiencePhoneAppointmentsEnabled = true,
    checkInExperienceLorotaDeletionEnabled = true,
    checkInExperienceTravelReimbursement = false,
    checkInExperienceBrowserMonitoring = false,
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
          name: 'check_in_experience_phone_appointments_enabled',
          value: checkInExperiencePhoneAppointmentsEnabled,
        },
        {
          name: 'check_in_experience_lorota_deletion_enabled',
          value: checkInExperienceLorotaDeletionEnabled,
        },
        {
          name: 'check_in_experience_travel_reimbursement',
          value: checkInExperienceTravelReimbursement,
        },
        {
          name: 'check_in_experience_browser_monitoring',
          value: checkInExperienceBrowserMonitoring,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
