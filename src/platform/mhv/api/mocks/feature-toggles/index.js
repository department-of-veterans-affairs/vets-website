const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvBypassDowntimeNotification = false,

    // medications
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayGrouping = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsPartialFillContent,
    mhvMedicationsDontIncrementIpeCount,
    mhvMedicationsManagementImprovements = false,
    mhvMedicationsOracleHealthCutover = false,

    // OH integration work
    mhvMedicalRecordsCcdExtendedFileTypes = true,
    mhvMedicalRecordsCcdOH = true,
    mhvMedicalRecordsHoldTimeMessagingUpdate = true,
    mhvMedicalRecordsImagesDomain = false,
    mhvMedicalRecordsMergeCvixIntoScdf = false,
    mhvAcceleratedDeliveryEnabled = false,
    mhvAcceleratedDeliveryAllergiesEnabled = false,
    mhvAcceleratedDeliveryCareNotesEnabled = false,
    mhvAcceleratedDeliveryVitalSignsEnabled = false,
    mhvAcceleratedDeliveryConditionsEnabled = false,
    mhvAcceleratedDeliveryVaccinesEnabled = false,
    mhvAcceleratedDeliveryLabsAndTestsEnabled = false,
    mhvMedicationsDisplayNewCernerFacilityAlert = true,

    // secure messaging
    mhvSecureMessagingTriageGroupPlainLanguage = false,
    mhvSecureMessagingRecipientOptGroups = true,
    mhvSecureMessagingRecipientCombobox = false,
    mhvSecureMessagingCernerPilot = true,
    mhvSecureMessagingLargeAttachments = true,
    mhvSecureMessagingCuratedListFlow = true,
    mhvSecureMessagingRecentRecipients = true,
    mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag = false,
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
          name: 'mhv_medications_display_grouping',
          value: mhvMedicationsDisplayGrouping,
        },
        {
          name: 'mhv_medications_display_pending_meds',
          value: mhvMedicationsDisplayPendingMeds,
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
          name: 'mhv_medications_management_improvements',
          value: mhvMedicationsManagementImprovements,
        },
        {
          name: 'mhv_medications_oracle_health_cutover',
          value: mhvMedicationsOracleHealthCutover,
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
          name: 'mhv_medical_records_ccd_extended_file_types',
          value: mhvMedicalRecordsCcdExtendedFileTypes,
        },
        {
          name: 'mhv_medical_records_ccd_oh',
          value: mhvMedicalRecordsCcdOH,
        },
        {
          name: 'mhv_medical_records_hold_time_messaging_update',
          value: mhvMedicalRecordsHoldTimeMessagingUpdate,
        },
        {
          name: 'mhv_medical_records_images_domain',
          value: mhvMedicalRecordsImagesDomain,
        },
        {
          name: 'mhv_medical_records_merge_cvix_into_scdf',
          value: mhvMedicalRecordsMergeCvixIntoScdf,
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
        {
          name: 'mhvSecureMessagingRecentRecipients',
          value: mhvSecureMessagingRecentRecipients,
        },
        {
          name:
            'mhv_secure_messaging_cerner_pilot_system_maintenance_banner_flag',
          value: mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
