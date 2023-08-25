const generateFeatureToggles = (toggles = {}) => {
  const {
    myVaUseExperimental = true,
    myVaUseLighthouseClaims = true,
    myVaNotificationDotIndicator = true,
    myVaUpdateErrorsWarnings = true,
    vaOnlineSchedulingBreadcrumbUrlUpdate = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'my_va_experimental',
          value: myVaUseExperimental,
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
