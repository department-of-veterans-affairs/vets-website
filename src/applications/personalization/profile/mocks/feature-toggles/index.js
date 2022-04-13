const generateFeatureToggles = (toggles = {}) => {
  const {
    profileDoNotRequireInternationalZipCode = true,
    profileEnhancements = true,
    profileNotificationSettings = true,
    profileSchemaForms = true,
    profileShowAddressChangeModal = true,
    profileShowDemographics = false,
    profileShowFaxNumber = false,
    profileShowGender = false,
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
        { name: 'profile_show_demographics', value: profileShowDemographics },
        { name: 'profile_show_fax_number', value: profileShowFaxNumber },
        { name: 'profile_show_gender', value: profileShowGender },
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
