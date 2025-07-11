const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvBypassDowntimeNotification = false,

    // medications
    mhvMedicationsToVaGovRelease = true,
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayFilter = true,
    mhvMedicationsDisplayGrouping = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsDisplayRefillProgress = true,
    mhvMedicationsShowIpeContent = true,
    mhvMedicationsPartialFillContent,
    mhvMedicationsDontIncrementIpeCount,
    mhvMedicationsRemoveLandingPage = true,

    // medical records
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
    mhvMedicalRecordsMarch17Updates = true,

    // OH integration work
    mhvAcceleratedDeliveryEnabled = false,
    mhvAcceleratedDeliveryAllergiesEnabled = false,
    mhvAcceleratedDeliveryVitalSignsEnabled = false,
    mhvAcceleratedDeliveryVaccinesEnabled = false,
    mhvAcceleratedDeliveryLabsAndTestsEnabled = false,

    mhvMedicalRecordsMilestoneTwo = false,

    // secure messaging
    mhvSecureMessagingTriageGroupPlainLanguage = false,
    mhvSecureMessagingRecipientOptGroups = true,
    mhvSecureMessagingRecipientCombobox = true,
    mhvSecureMessagingCernerPilot = true,
    mhvSecureMessagingLargeAttachments = true,
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
          name: 'mhv_bypass_downtime_notification',
          value: mhvBypassDowntimeNotification,
        },
        {
          name: 'mhv_accelerated_delivery_enabled',
          value: mhvAcceleratedDeliveryEnabled,
        },
        {
          name: 'mhv_accelerated_delivery_allergies_enabled',
          value: mhvAcceleratedDeliveryAllergiesEnabled,
        },
        {
          name: 'mhv_accelerated_delivery_vaccines_enabled',
          value: mhvAcceleratedDeliveryVaccinesEnabled,
        },
        {
          name: 'mhv_accelerated_delivery_vital_signs_enabled',
          value: mhvAcceleratedDeliveryVitalSignsEnabled,
        },
        {
          name: 'mhv_accelerated_delivery_labs_and_tests_enabled',
          value: mhvAcceleratedDeliveryLabsAndTestsEnabled,
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
          name: 'mhv_medications_dont_increment_ipe_count',
          value: mhvMedicationsDontIncrementIpeCount,
        },

        // medical records
        {
          name: 'mhv_medical_records_kill_external_links',
          value: true,
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
          name: 'mhv_medical_records_update_landing_page',
          value: mhvMedicalRecordsMarch17Updates,
        },
        {
          name: 'mhv_medical_records_milestone_two',
          value: mhvMedicalRecordsMilestoneTwo,
        },

        // secure messaging
        {
          name: 'mhv_secure_messaging_triage_group_plain_language',
          value: mhvSecureMessagingTriageGroupPlainLanguage,
        },
        {
          name: 'mhv_secure_messaging_recipient_opt_groups',
          value: mhvSecureMessagingRecipientOptGroups,
        },
        {
          name: 'mhv_secure_messaging_recipient_combobox',
          value: mhvSecureMessagingRecipientCombobox,
        },
        {
          name: 'mhv_secure_messaging_cerner_pilot',
          value: mhvSecureMessagingCernerPilot,
        },
        {
          name: 'mhv_secure_messaging_large_attachments',
          value: mhvSecureMessagingLargeAttachments,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
