const { snakeCase } = require('lodash');

// add and remove feature toggles here by name, but generally keep all values as false
// instead use generateFeatureToggles in server.js to set the toggle values
const profileToggles = {
  authExpVbaDowntimeMessage: false,
  profileContacts: false,
  profileShowPronounsAndSexualOrientation: false,
  profileHideDirectDepositCompAndPen: false,
  profileShowPaymentsNotificationSetting: false,
  profileShowMhvNotificationSettings: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileShowCredentialRetirementMessaging: false,
  profileShowEmailNotificationSettings: false,
  profileShowProofOfVeteranStatus: false,
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

  const togglesCamelCased = Object.entries(toggles).map(([key, value]) => {
    return {
      name: key,
      value,
    };
  });

  const togglesSnakeCased = Object.entries(toggles).map(([key, value]) => {
    return {
      name: snakeCase(key),
      value,
    };
  });

  return {
    data: {
      type: 'feature_toggles',
      features: [...togglesSnakeCased, ...togglesCamelCased],
    },
  };
};

module.exports = { generateFeatureToggles };
