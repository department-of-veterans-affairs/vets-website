const generateFeatureToggles = (toggles = {}) => {
  const {
    myVaEnableNotificationComponent = true,
    myVaHideNotificationsSection = true,
    myVaUseExperimental = true,
    myVaUseExperimentalFrontend = true,
    myVaUseExperimentalFullstack = true,
    myVaUseLighthouseClaims = true,
    myVaNotificationDotIndicator = true,
    myVaRemoveCernerMessage = true,
    myVaUpdateErrorsWarnings = true,
    vaOnlineSchedulingBreadcrumbUrlUpdate = true,
    vaOnlineSchedulingStaticLandingPage = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
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
          name: 'my_va_lighthouse_claims',
          value: myVaUseLighthouseClaims,
        },
        {
          name: 'my_va_notification_dot_indicator',
          value: myVaNotificationDotIndicator,
        },
        {
          name: 'my_va_remove_cerner_message',
          value: myVaRemoveCernerMessage,
        },
        {
          name: 'my_va_update_errors_warnings',
          value: myVaUpdateErrorsWarnings,
        },
        {
          name: 'va_online_scheduling_breadcrumb_url_update',
          value: vaOnlineSchedulingBreadcrumbUrlUpdate,
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
