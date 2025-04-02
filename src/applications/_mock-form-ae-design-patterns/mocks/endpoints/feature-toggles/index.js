const { snakeCase } = require('lodash');

// add and remove feature toggles here by name, but generally keep all values as false
// instead use generateFeatureToggles in server.js to set the toggle values
const profileToggles = {
  aedpVADX: false,
  aedpPrefill: false,
  profileUseExperimental: false,
  coeAccess: true,
  showEduBenefits1990Wizard: true,
  showEduBenefits0994Wizard: true,
  showEduBenefits1995Wizard: true,
  showEduBenefits5495Wizard: true,
  showEduBenefits1990nWizard: true,
  showEduBenefits5490Wizard: true,
  showEduBenefits1990eWizard: true,
};

const makeAllTogglesTrue = toggles => {
  const result = { ...toggles };
  Object.keys(result).forEach(key => {
    result[key] = true;
  });
  return result;
};

/**
 * Generates feature toggles mock api response object for profile app
 *
 * @param {*} values - set specific values to true or false
 * @param {*} allOn - set all values to true
 * @returns
 */
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

const generateFeatureTogglesState = (
  values = profileToggles,
  allOn = false,
) => {
  return {
    featureToggles: generateFeatureToggles(values, allOn).data.features.reduce(
      (acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      },
      { loading: false },
    ),
  };
};

module.exports = { generateFeatureToggles, generateFeatureTogglesState };
