import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { keyBy } from 'lodash';

const getFlag = (name = '', value = false) => {
  const flag = FEATURE_FLAG_NAMES[name];
  if (!flag) {
    throw new Error(
      `Feature flag "${name}" not found in the platform's feature-toggle list. Did you remember to add the toggle name(s) to @department-of-veterans-affairs/platform-utilities/featureFlagNames?`,
    );
  }
  return {
    name: flag,
    value,
  };
};

const getFlagsByPrefix = (prefix = '', value = false) =>
  Object.keys(FEATURE_FLAG_NAMES)
    .filter(name => name.startsWith(prefix))
    .map(name => getFlag(name, value));

const generateDefaultToggles = (value = false) => [
  ...getFlagsByPrefix('myVa', value),
  getFlag('authExpVbaDowntimeMessage', value),
  getFlag('vaOnlineSchedulingStaticLandingPage', value),
  getFlag('profileUseExperimental', value),
];

const asApiResponseData = (featureToggles = []) => ({
  data: {
    type: 'feature_toggles',
    features: featureToggles,
  },
});

const generateFeatureToggles = (toggles = {}, defaultValue = false) => {
  const defaultToggles = generateDefaultToggles(defaultValue);
  const customToggles = [];
  const toggleMap = keyBy(defaultToggles, o => o.name);

  Object.keys(toggles).forEach(name => {
    const serverName = FEATURE_FLAG_NAMES[name];
    const foundInDefaults = serverName && toggleMap[serverName];
    if (foundInDefaults) {
      toggleMap[serverName].value = toggles[name];
    } else {
      customToggles.push(getFlag(name, toggles[name]));
    }
  });

  return asApiResponseData([...Object.values(toggleMap), ...customToggles]);
};

module.exports = {
  generateFeatureToggles,
  getFlagsByPrefix,
  getFlag,
  asApiResponseData,
};
