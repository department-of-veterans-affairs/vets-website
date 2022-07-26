const generateFeatureToggles = (toggles = {}) => {
  const {
    profileDoNotRequireInternationalZipCode = true,
    profileEnhancements = true,
    profileNotificationSettings = true,
    profileSchemaForms = true,
    profileShowAddressChangeModal = true,
    profileShowBadAddressIndicator = true,
    profileShowDemographics = false,
    profileForceBadAddressIndicator = false,
    profileShowProfile2 = false,
    profileShowPronounsAndSexualOrientation = false,
    profileShowReceiveTextNotifications = true,
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
        {
          name: 'profile_show_bad_address_indicator',
          value: profileShowBadAddressIndicator,
        },
        { name: 'profile_show_demographics', value: profileShowDemographics },
        {
          name: 'profile_force_bad_address_indicator',
          value: profileForceBadAddressIndicator,
        },
        { name: 'profile_show_profile_2.0', value: profileShowProfile2 },
        {
          name: 'profile_show_pronouns_and_sexual_orientation',
          value: profileShowPronounsAndSexualOrientation,
        },
        {
          name: 'profile_show_receive_text_notifications',
          value: profileShowReceiveTextNotifications,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
