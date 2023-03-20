const generateFeatureToggles = (toggles = {}) => {
  const {
    profileDoNotRequireInternationalZipCode = true,
    profileNotificationSettings = true,
    profileShowPronounsAndSexualOrientation = false,
    profileShowReceiveTextNotifications = true,
    profileUseVAFSC = false,
    profileHideDirectDepositCompAndPen = false,
    profileShowPaymentsNotificationSetting = false,
    profileUseInfoCard = true,
    profileUseFieldEditingPage = true,
    profileShowMhvNotificationSettings = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'profile_do_not_require_international_zip_code',
          value: profileDoNotRequireInternationalZipCode,
        },
        {
          name: 'profile_notification_settings',
          value: profileNotificationSettings,
        },
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
          name: 'profile_use_info_card',
          value: profileUseInfoCard,
        },
        {
          name: 'profile_show_mhv_notification_settings',
          value: profileShowMhvNotificationSettings,
        },
        {
          name: 'profile_use_field_editing_page',
          value: profileUseFieldEditingPage,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
