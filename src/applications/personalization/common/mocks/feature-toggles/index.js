const generateFeatureToggles = (toggles = {}) => {
  const {
    myVaEnableNotificationComponent = true,
    myVaUseExperimental = true,
    myVaUseExperimentalFrontend = true,
    myVaUseExperimentalFullstack = true,
    myVaUseLighthouseClaims = true,
    myVaUpdateErrorsWarnings = true,
    vaOnlineSchedulingBreadcrumbUrlUpdate = true,
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
          name: 'my_va_experimental',
          value: myVaUseExperimental,
        },
        {
          name: 'my_va_experimental_fe',
          value: myVaUseExperimentalFrontend,
        },
        {
          name: 'my_va_experimental_fs',
          value: myVaUseExperimentalFullstack,
        },
        {
          name: 'my_va_lighthouse_claims',
          value: myVaUseLighthouseClaims,
        },
        {
          name: 'my_va_update_errors_warnings',
          value: myVaUpdateErrorsWarnings,
        },
        {
          name: 'va_online_scheduling_breadcrumb_url_update',
          value: vaOnlineSchedulingBreadcrumbUrlUpdate,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
