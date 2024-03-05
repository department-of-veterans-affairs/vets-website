const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvSecureMessagingToVAGovRelease = true,
    mhvMedicalRecordsToVaGovRelease = true,
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
          value: true,
        },
        {
          name: 'mhv_medical_records_allow_txt_downloads',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_conditions',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_domains',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_labs_and_tests',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_notes',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_vaccines',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_vitals',
          value: true,
        },
        {
          name: 'mhv_medical_records_display_sidenav',
          value: true,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
