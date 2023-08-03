const { snakeCase } = require('lodash');

const defaultToggleValues = {
  profileDoNotRequireInternationalZipCode: true,
  profileShowPronounsAndSexualOrientation: false,
  profileHideDirectDepositCompAndPen: false,
  profileShowPaymentsNotificationSetting: true,
  profileUseInfoCard: true,
  profileUseFieldEditingPage: true,
  profileShowMhvNotificationSettings: true,
  profileLighthouseDirectDeposit: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileUseNotificationSettingsCheckboxes: false,
  profileShowEmailNotificationSettings: true,
};

const generateFeatureToggles = (values = defaultToggleValues) => {
  const mergedValues = { ...defaultToggleValues, ...values };

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
