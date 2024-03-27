const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvSecureMessagingToVAGovRelease = true,
    mhvMedicalRecordsToVaGovRelease = true,
    mhvLandingPageEnabled = true,
    mhvMedicalRecordsAllowTxtDownloads = true,
    mhvMedicalRecordsDisplayConditions = true,
    mhvMedicalRecordsDisplayDomains = true,
    mhvMedicalRecordsDisplayLabsAndTests = true,
    mhvMedicalRecordsDisplayNotes = true,
    mhvMedicalRecordsDisplayVaccines = true,
    mhvMedicalRecordsDisplayVitals = true,
    mhvMedicalRecordsDisplaySidenav = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'mhv_secure_messaging_to_va_gov_release',
          value: mhvSecureMessagingToVAGovRelease,
        },
        {
          name: 'mhv_medical_records_to_va_gov_release',
          value: mhvMedicalRecordsToVaGovRelease,
        },
        {
          name: 'mhv_landing_page_enabled',
          value: mhvLandingPageEnabled,
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
          name: 'mhv_medical_records_display_vaccines',
          value: mhvMedicalRecordsDisplayVaccines,
        },
        {
          name: 'mhv_medical_records_display_vitals',
          value: mhvMedicalRecordsDisplayVitals,
        },
        {
          name: 'mhv_medical_records_display_sidenav',
          value: mhvMedicalRecordsDisplaySidenav,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
