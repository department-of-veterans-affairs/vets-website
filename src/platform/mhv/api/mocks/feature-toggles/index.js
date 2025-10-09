const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvBypassDowntimeNotification = false,

    // medications
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayFilter = true,
    mhvMedicationsDisplayGrouping = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsDisplayRefillProgress = true,
    mhvMedicationsShowIpeContent = true,
    mhvMedicationsPartialFillContent,
    mhvMedicationsDontIncrementIpeCount,
    mhvMedicationsDisplayNewCernerFacilityAlert = true,

    // medical records
    mhvMedicalRecordsAllowTxtDownloads = true,
    mhvMedicalRecordsToVaGovRelease = true,
    mhvMedicalRecordsMarch17Updates = true,

    // OH integration work
    mhvAcceleratedDeliveryEnabled = false,
    mhvAcceleratedDeliveryAllergiesEnabled = false,
    mhvAcceleratedDeliveryCareNotesEnabled = false,
    mhvAcceleratedDeliveryVitalSignsEnabled = false,
    mhvAcceleratedDeliveryConditionsEnabled = false,
    mhvAcceleratedDeliveryVaccinesEnabled = false,
    mhvAcceleratedDeliveryLabsAndTestsEnabled = false,

    // secure messaging
    mhvSecureMessagingTriageGroupPlainLanguage = false,
    mhvSecureMessagingRecipientOptGroups = true,
    mhvSecureMessagingRecipientCombobox = false,
    mhvSecureMessagingCernerPilot = true,
    mhvSecureMessagingLargeAttachments = true,
    mhvSecureMessagingCuratedListFlow = true,
    mhvSecureMessagingRecentRecipients = true,
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
          name: 'mhv_accelerated_delivery_care_notes_enabled',
          value: mhvAcceleratedDeliveryCareNotesEnabled,
        },
        {
          name: 'mhv_accelerated_delivery_conditions_enabled',
          value: mhvAcceleratedDeliveryConditionsEnabled,
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
        {
          name: 'mhv_medications_display_new_cerner_facility_alert',
          value: mhvMedicationsDisplayNewCernerFacilityAlert,
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
          name: 'mhv_medical_records_to_va_gov_release',
          value: mhvMedicalRecordsToVaGovRelease,
        },
        {
          name: 'mhv_medical_records_update_landing_page',
          value: mhvMedicalRecordsMarch17Updates,
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
        {
          name: 'mhv_secure_messaging_curated_list_flow',
          value: mhvSecureMessagingCuratedListFlow,
        },
        {
          name: 'mhv_secure_messaging_recent_recipients',
          value: mhvSecureMessagingRecentRecipients,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
