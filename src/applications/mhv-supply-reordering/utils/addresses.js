import constants from 'vets-json-schema/dist/constants.json';

const { countries, militaryStates, states50AndDC, states } = constants;

const caseInsensitiveComparison = (a, b) => {
  return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
};

const countryNameToValue = name => {
  let countryName = name.trim();

  // Convert from DLC APO format.
  if (countryName.startsWith('ARMED FORCES')) {
    countryName = 'United States';
  }

  const country = countries.find(countryMapping =>
    caseInsensitiveComparison(countryMapping.label, countryName),
  );
  return country ? country.value : countryName;
};

const countryValueToName = countryValue => {
  const country = countries.find(countryMapping =>
    caseInsensitiveComparison(countryMapping.value, countryValue),
  );
  return country ? country.label : countryValue;
};

const isMilitaryState = stateName => {
  const militaryStateValues = militaryStates.map(state => state.value);
  return militaryStateValues.includes(stateName);
};

const usTerritories = () => {
  // Get states from usaStates and remove the values in states50AndDC and militaryStates
  const usaStateLabels = states.USA.map(state => state.label);
  const militaryStateLabels = militaryStates.map(state => state.label);
  const states50AndDCLabels = states50AndDC.map(state => state.label);
  return usaStateLabels.filter(
    state =>
      !militaryStateLabels.includes(state) &&
      !states50AndDCLabels.includes(state),
  );
};

const isTerritory = countryName => {
  const territoryMatch = usTerritories().find(territory => {
    return caseInsensitiveComparison(territory, countryName);
  });
  return Boolean(territoryMatch);
};

export {
  caseInsensitiveComparison,
  countryNameToValue,
  countryValueToName,
  isMilitaryState,
  isTerritory,
  usTerritories,
};
