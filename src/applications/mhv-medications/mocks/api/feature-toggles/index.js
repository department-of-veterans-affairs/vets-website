const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvMedicationsToVaGovRelease = true,
    mhvMedicationsDisplayRefillContent = true,
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayFilter = true,
    mhvMedicationsDisplayGrouping = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsDisplayRefillProgress = true,
    mhvMedicationsRemoveLandingPage = true,
    mhvMedicationsShowIpeContent = true,
    mhvMedicationsPartialFillContent = true,
    mhvMedicationsIpeShowHideCriteria = true,
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
          name: 'mhv_medications_to_va_gov_release',
          value: mhvMedicationsToVaGovRelease,
        },
        {
          name: 'mhv_medications_display_refill_content',
          value: mhvMedicationsDisplayRefillContent,
        },
        {
          name: 'mhv_medications_display_documentation_content',
          value: mhvMedicationsDisplayDocumentationContent,
        },
        {
          name: 'mhv_medications_display_filter',
          value: mhvMedicationsDisplayFilter,
        },
        {
          name: 'mhv_medications_display_grouping',
          value: mhvMedicationsDisplayGrouping,
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
          name: 'mhv_medications_remove_landing_page',
          value: mhvMedicationsRemoveLandingPage,
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
          name: 'mhv_medications_ipe_show_hide_criteria',
          value: mhvMedicationsIpeShowHideCriteria,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
