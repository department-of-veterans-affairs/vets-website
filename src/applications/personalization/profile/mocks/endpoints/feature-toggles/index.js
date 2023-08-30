const { snakeCase } = require('lodash');

// add and remove feature toggles here by name, but generally keep all values as false
// instead use generateFeatureToggles in server.js to set the toggle values
const profileToggles = {
  profileShowPronounsAndSexualOrientation: false,
  profileHideDirectDepositCompAndPen: false,
  profileShowPaymentsNotificationSetting: false,
  profileUseFieldEditingPage: false,
  profileUseHubPage: false,
  profileShowMhvNotificationSettings: false,
  profileLighthouseDirectDeposit: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileUseNotificationSettingsCheckboxes: false,
  profileShowEmailNotificationSettings: false,
  showAuthenticatedMenuEnhancements: false,
};

const makeAllTogglesTrue = toggles => {
  const result = { ...toggles };
  Object.keys(result).forEach(key => {
    result[key] = true;
  });
  return result;
};

const generateFeatureToggles = (values = profileToggles, allOn = false) => {
  const toggles = allOn
    ? makeAllTogglesTrue(profileToggles)
    : { ...profileToggles, ...values };

  const features = Object.entries(toggles).map(([key, value]) => {
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
