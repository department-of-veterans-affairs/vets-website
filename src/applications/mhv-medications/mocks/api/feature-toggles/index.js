const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsDisplayRefillProgress = true,
    mhvMedicationsShowIpeContent = true,
    mhvMedicationsPartialFillContent = true,
    mhvMedicationsDontIncrementIpeCount = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_landing_page_personalization',
          value: mhvLandingPagePersonalization,
        },
        {
          name: 'mhv_medications_display_documentation_content',
          value: mhvMedicationsDisplayDocumentationContent,
        },
        {
          name: 'mhv_medications_display_pending_meds',
          value: mhvMedicationsDisplayPendingMeds,
        },
        {
          name: 'mhv_medications_display_refill_progress',
          value: mhvMedicationsDisplayRefillProgress,
        },
        {
          name: 'mhv_medications_show_ipe_content',
          value: mhvMedicationsShowIpeContent,
        },
        {
          name: 'mhv_medications_partial_fill_content',
          value: mhvMedicationsPartialFillContent,
        },
        {
          name: 'mhv_medications_dont_increment_ipe_count',
          value: mhvMedicationsDontIncrementIpeCount,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
