const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    preCheckInEnabled = true,
    checkInExperienceTranslationDisclaimerSpanishEnabled = true,
    checkInExperienceTranslationDislaimerTagalogEnabled = true,
    checkInExperienceTravelReimbursement = true,
    checkInExperienceTravelLogic = true,
    checkInExperienceBrowserMonitoring = false,
    checkInExperiencePreCheckInActionLinkTopPlacement = true,
    checkInExperienceUpcomingAppointmentsEnabled = true,
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
          name: 'check_in_experience_translation_disclaimer_tagalog_enabled',
          value: checkInExperienceTranslationDislaimerTagalogEnabled,
        },
        {
          name: 'check_in_experience_travel_reimbursement',
          value: checkInExperienceTravelReimbursement,
        },
        {
          name: 'check_in_experience_travel_logic',
          value: checkInExperienceTravelLogic,
        },
        {
          name: 'check_in_experience_browser_monitoring',
          value: checkInExperienceBrowserMonitoring,
        },
        {
          name: 'check_in_experience_pre_check_in_action_link_top_placement',
          value: checkInExperiencePreCheckInActionLinkTopPlacement,
        },
        {
          name: 'check_in_experience_upcoming_appointments_enabled',
          value: checkInExperienceUpcomingAppointmentsEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
