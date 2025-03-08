// from array choose k sized arr of elements
function arrayChooseK(arr, k, state = []) {
  if (k === 0) return [state]; // base condition
  return arr.flatMap((v, i) =>
    arrayChooseK(arr.slice(i + 1), k - 1, [...state, v]),
  );
}

/**
 * creates objects from combination array
 * @param {*} togglesCombinations combination array of strings (flipper names)
 * @param {*} toggleNames original list of flipper names (strings)
 * @returns - array of objects with name and value - where true for flipper present in combination
 *  and false for not present in the combinations
 */
function createFlipperFeatureSet(togglesCombinations, toggleNames) {
  return togglesCombinations.map(toggles => {
    const toggleSet = [];
    toggleNames.forEach(name => {
      if (!toggles.includes(name)) {
        toggleSet.push({ name, value: false });
      } else {
        toggleSet.push({ name, value: true });
      }
    });
    return toggleSet;
  });
}
/**
 * Creates all possible flipper combinations in feature sets to see if there are interactions
 * @param {string[]} toggleNames array of strings (flipper names)
 * @returns 2d array of all possible flipper combinations in feature sets
 * (to be returned from mocked features endpoint)
 */
export function featureCombinationsTogglesToTest(toggleNames = []) {
  if (toggleNames.length === 0) {
    return [];
  }
  const togglesCombinations = [];
  for (let i = 0; i <= toggleNames.length; i++) {
    const toggles = arrayChooseK(toggleNames, i);
    togglesCombinations.push(...toggles);
  }
  return createFlipperFeatureSet(togglesCombinations, toggleNames);
}

// Used as: featureSet.some(isFeatureEnabled('featureName'))
// to check if feature is enabled in the currently tested featureSet when
// iterating over feature sets in case the test needs to know whether a
// specific feature is enabled
export function isFeatureEnabled(featureName) {
  return function isEnabled(feature) {
    return feature.name === featureName && feature.value;
  };
}

// Used in the block/describe/test message/name to show which features are enabled
// in the current feature set - useful for checking where the errors happen
export function enabledFeatures(features) {
  return features
    .filter(feature => feature.value)
    .map(feature => feature.name)
    .join(',');
}
