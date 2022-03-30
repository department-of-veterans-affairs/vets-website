const generateFeatureToggles = (toggles = {}) => {
  const {
    checkInExperienceEnabled = true,
    preCheckInEnabled = true,
    checkInExperienceUpdateInformationPageEnabled = false,
    checkInExperienceEditingDayOfEnabled = false,
    checkInExperienceEditingPreCheckInEnabled = true,
    checkInExperienceTranslationDayOfEnabled = true,
    checkInExperienceTranslationPreCheckInEnabled = true,
    checkInExperienceDayOfDemographicsFlagsEnabled = true,
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
          name: 'check_in_experience_day_of_demographics_flags_enabled',
          value: checkInExperienceDayOfDemographicsFlagsEnabled,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
