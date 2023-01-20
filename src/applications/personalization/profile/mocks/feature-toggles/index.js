const generateFeatureToggles = (toggles = {}) => {
  const {
    profileDoNotRequireInternationalZipCode = true,
    profileEnhancements = true,
    profileNotificationSettings = true,
    profileSchemaForms = true,
    profileShowAddressChangeModal = true,
    profileShowDemographics = false,
    profileShowProfile2 = false,
    profileShowPronounsAndSexualOrientation = false,
    profileShowReceiveTextNotifications = true,
    profileUseVAFSC = false,
    profileHideDirectDepositCompAndPen = false,
    profileShowPaymentsNotificationSetting = false,
    profileBlockForFiduciaryDeceasedOrIncompetent = false,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'profile_do_not_require_international_zip_code',
          value: profileDoNotRequireInternationalZipCode,
        },
        { name: 'profile_enhancements', value: profileEnhancements },
        {
          name: 'profile_notification_settings',
          value: profileNotificationSettings,
        },
        { name: 'profile_schema_forms', value: profileSchemaForms },
        {
          name: 'profile_show_address_change_modal',
          value: profileShowAddressChangeModal,
        },
        { name: 'profile_show_demographics', value: profileShowDemographics },

        { name: 'profile_show_profile_2.0', value: profileShowProfile2 },
        {
          name: 'profile_show_pronouns_and_sexual_orientation',
          value: profileShowPronounsAndSexualOrientation,
        },
        {
          name: 'profile_show_receive_text_notifications',
          value: profileShowReceiveTextNotifications,
        },
        {
          name: 'profile_use_vafsc',
          value: profileUseVAFSC,
        },
        {
          name: 'profile_hide_direct_deposit_comp_and_pen',
          value: profileHideDirectDepositCompAndPen,
        },
        {
          name: 'profile_show_payments_notification_setting',
          value: profileShowPaymentsNotificationSetting,
        },
        {
          name: 'profile_block_for_fiduciary_deceased_or_incompetent',
          value: profileBlockForFiduciaryDeceasedOrIncompetent,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
