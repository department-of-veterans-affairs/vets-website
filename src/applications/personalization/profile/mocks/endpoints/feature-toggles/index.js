const { snakeCase } = require('lodash');

// add and remove feature toggles here by name, but generally keep all values as false
// instead use generateFeatureToggles in server.js to set the toggle values
const profileToggles = {
  profileShowPronounsAndSexualOrientation: false,
  profileHideDirectDepositCompAndPen: false,
  profileShowPaymentsNotificationSetting: false,
  profileUseInfoCard: false,
  profileUseFieldEditingPage: false,
  profileShowMhvNotificationSettings: false,
  profileLighthouseDirectDeposit: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileUseNotificationSettingsCheckboxes: false,
  profileShowEmailNotificationSettings: false,
};

const generateFeatureToggles = (values = profileToggles) => {
  const mergedValues = { ...profileToggles, ...values };

  const features = Object.entries(mergedValues).map(([key, value]) => {
    return {
      name: snakeCase(key),
      value,
    };
  });

  return {
    data: {
      type: 'feature_toggles',
      features,
    },
  };
};

module.exports = { generateFeatureToggles };
