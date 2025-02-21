// from array choose k sized arr of elements
function arrayChooseK(arr, k, state = []) {
  if (k === 0) return [state]; // base condition
  return arr.flatMap((v, i) =>
    arrayChooseK(arr.slice(i + 1), k - 1, [...state, v]),
  );
}

function createObjects(togglesCombinations, toggleNames) {
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

export function featureCombinationsTogglesToTest(toggleNames = []) {
  if (toggleNames.length === 0) {
    return [];
  }
  const togglesCombinations = [];
  for (let i = 0; i <= toggleNames.length; i++) {
    const toggles = arrayChooseK(toggleNames, i);
    togglesCombinations.push(...toggles);
  }
  return createObjects(togglesCombinations, toggleNames);
}

export function isFeatureEnabled(featureName) {
  return function isEnabled(feature) {
    return feature.name === featureName && feature.value;
  };
}

export function enabledFeatures(features) {
  return features
    .filter(feature => feature.value)
    .map(feature => feature.name)
    .join(',');
}
