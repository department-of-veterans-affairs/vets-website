const generateFeatureToggles = (toggles = {}) => {
  const {
    authExpVbaDowntimeMessage = true,
    myVaEnableNotificationComponent = true,
    myVaHideNotificationsSection = true,
    myVaUseExperimental = true,
    myVaUseExperimentalFrontend = true,
    myVaUseExperimentalFullstack = true,
    myVaNotificationDotIndicator = true,
    myVaEnableMhvLink = true,
    myVaUpdateErrorsWarnings = true,
    vaOnlineSchedulingStaticLandingPage = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'auth_exp_vba_downtime_message',
          value: authExpVbaDowntimeMessage,
        },
        {
          name: 'my_va_notification_component',
          value: myVaEnableNotificationComponent,
        },
        {
          name: 'my_va_hide_notifications_section',
          value: myVaHideNotificationsSection,
        },
        {
          name: 'my_va_experimental',
          value: myVaUseExperimental,
        },
        {
          name: 'my_va_experimental_frontend',
          value: myVaUseExperimentalFrontend,
        },
        {
          name: 'my_va_experimental_fullstack',
          value: myVaUseExperimentalFullstack,
        },
        {
          name: 'my_va_notification_dot_indicator',
          value: myVaNotificationDotIndicator,
        },
        {
          name: 'my_va_enable_mhv_link',
          value: myVaEnableMhvLink,
        },
        {
          name: 'my_va_update_errors_warnings',
          value: myVaUpdateErrorsWarnings,
        },
        {
          name: 'va_online_scheduling_static_landing_page',
          value: vaOnlineSchedulingStaticLandingPage,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
