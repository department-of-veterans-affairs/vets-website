const generateFeatureToggles = (toggles = {}) => {
  const {
    mhvLandingPagePersonalization = true,
    mhvMedicationsDisplayDocumentationContent = true,
    mhvMedicationsDisplayPendingMeds = true,
    mhvMedicationsPartialFillContent = true,
    mhvMedicationsDontIncrementIpeCount = true,
    mhvAcceleratedDeliveryEnabled = true,
    mhvAcceleratedDeliveryAllergiesEnabled = true,
    mhvMedicationsDisplayNewCernerFacilityAlert = true,
    mhvSecureMessagingMedicationsRenewalRequest = true,
    mhvMedicationsCernerPilot = false,
    mhvMedicationsV2StatusMapping = false,
    mhvMedicationsEnableKramesHtmlSanitization = true,
    mhvMedicationsManagementImprovements = false,
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
          name: 'mhv_medications_partial_fill_content',
          value: mhvMedicationsPartialFillContent,
        },
        {
          name: 'mhv_medications_dont_increment_ipe_count',
          value: mhvMedicationsDontIncrementIpeCount,
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
          name: 'mhv_medications_display_new_cerner_facility_alert',
          value: mhvMedicationsDisplayNewCernerFacilityAlert,
        },
        {
          name: 'mhv_secure_messaging_medications_renewal_request',
          value: mhvSecureMessagingMedicationsRenewalRequest,
        },
        {
          name: 'mhvSecureMessagingMedicationsRenewalRequest',
          value: mhvSecureMessagingMedicationsRenewalRequest,
        },
        {
          name: 'mhv_medications_cerner_pilot',
          value: mhvMedicationsCernerPilot,
        },
        {
          name: 'mhv_medications_v2_status_mapping',
          value: mhvMedicationsV2StatusMapping,
        },
        {
          name: 'mhv_medications_enable_krames_html_sanitization',
          value: mhvMedicationsEnableKramesHtmlSanitization,
        },
        {
          name: 'mhv_medications_management_improvements',
          value: mhvMedicationsManagementImprovements,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
