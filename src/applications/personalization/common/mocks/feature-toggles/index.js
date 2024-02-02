// import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
const { keyBy } = require('lodash');
const fs = require('fs');

const raw = String(
  fs.readFileSync(
    `${process.cwd()}/src/platform/utilities/feature-toggles/featureFlagNames.js`,
    { encoding: 'utf8', flag: 'r' },
  ),
);

// console.log('raw', raw, typeof raw);
// console.log('CWD', process.cwd());

const COMMENTS_MATCHER = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g;
const TUPLE_MATCHER = /(\S+\s*|\s*'\S+'\s*|\s*"\S+"\s*):\s*('\S+'|"\S+")/g;
const OBJECT_LITERAL_MATCHER = /({((\s*\S+\s*|\s*'\S+'\s*|\s*"\S+"\s*):\s*('\S+'|"\S+")\s*(,\s*}|}|,))+)/g;

const strippedComments = raw.replace(COMMENTS_MATCHER, '');
const rawObjects = strippedComments.match(OBJECT_LITERAL_MATCHER);
const rawProps = rawObjects[0].match(TUPLE_MATCHER); // grab first obj literal from file; only works as long as the flag index is the only one in file :P
const normalizedQuotes = rawProps
  .map(s => {
    if (s.match(/^[^'"`]\S+[^'"`]\s*:/)) {
      const tuple = s.split(':');
      return `"${tuple[0]}" : ${tuple[1]}`;
    }
    return s;
  })
  .join(',')
  .replace(/(`|')/g, `"`);
const featureFlagNames = JSON.parse(`{ ${normalizedQuotes} }`);

const getFlag = (name = '', value = false) => {
  const flag = featureFlagNames[name];
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
  Object.keys(featureFlagNames)
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
    const serverName = featureFlagNames[name];
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
