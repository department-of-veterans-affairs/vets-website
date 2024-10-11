const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvMedicationsToVaGovRelease = true,
    mhvMedicationsDisplayRefillContent = true,
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayFilter = true,

    // medical records
    mhvTransitionalMedicalRecordsLandingPage = true,
    mhvMedicalRecordsAllowTxtDownloads = true,
    mhvMedicalRecordsDisplayConditions = true,
    mhvMedicalRecordsDisplayDomains = true,
    mhvMedicalRecordsDisplayLabsAndTests = true,
    mhvMedicalRecordsDisplayNotes = true,
    mhvMedicalRecordsDisplaySidenav = true,
    mhvMedicalRecordsDisplayVaccines = true,
    mhvMedicalRecordsDisplaySettingsPage = true,
    mhvMedicalRecordsDisplayVitals = true,
    mhvMedicalRecordsToVaGovRelease = true,
    mhvSecureMessagingEditContactList = true,
    mhvSecureMessagingTriageGroupPlainLanguage = false,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv-mock-session',
          value: true,
        },
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

        // medical records
        {
          name: 'mhv_integration_medical_records_to_phase_1',
          value: true,
        },
        {
          name: 'mhv_medical_records_kill_external_links',
          value: true,
        },
        {
          name: 'mhv_transitional_medical_records_landing_page',
          value: mhvTransitionalMedicalRecordsLandingPage,
        },
        {
          name: 'mhv_medical_records_allow_txt_downloads',
          value: mhvMedicalRecordsAllowTxtDownloads,
        },
        {
          name: 'mhv_medical_records_display_conditions',
          value: mhvMedicalRecordsDisplayConditions,
        },
        {
          name: 'mhv_medical_records_display_domains',
          value: mhvMedicalRecordsDisplayDomains,
        },
        {
          name: 'mhv_medical_records_display_labs_and_tests',
          value: mhvMedicalRecordsDisplayLabsAndTests,
        },
        {
          name: 'mhv_medical_records_display_notes',
          value: mhvMedicalRecordsDisplayNotes,
        },
        {
          name: 'mhv_medical_records_display_sidenav',
          value: mhvMedicalRecordsDisplaySidenav,
        },
        {
          name: 'mhv_medical_records_display_vaccines',
          value: mhvMedicalRecordsDisplayVaccines,
        },
        {
          name: 'mhv_medical_records_display_settings_page',
          value: mhvMedicalRecordsDisplaySettingsPage,
        },
        {
          name: 'mhv_medical_records_display_vitals',
          value: mhvMedicalRecordsDisplayVitals,
        },
        {
          name: 'mhv_medical_records_to_va_gov_release',
          value: mhvMedicalRecordsToVaGovRelease,
        },
        {
          name: 'mhv_secure_messaging_edit_contact_list',
          value: mhvSecureMessagingEditContactList,
        },
        {
          name: 'mhv_secure_messaging_triage_group_plain_language',
          value: mhvSecureMessagingTriageGroupPlainLanguage,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
