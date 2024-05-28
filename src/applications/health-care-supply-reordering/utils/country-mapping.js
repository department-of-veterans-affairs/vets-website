import constants from 'vets-json-schema/dist/constants.json';

const caseInsensitiveComparison = (a, b) => {
  return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
};

const nameToValue = name => {
  let countryName = name.trim();

  // Convert from DLC APO format.
  if (countryName.startsWith('ARMED FORCES')) {
    countryName = 'United States';
  }

  const country = constants.countries.find(countryMapping =>
    caseInsensitiveComparison(countryMapping.label, countryName),
  );
  return country ? country.value : countryName;
};

const valueToName = countryValue => {
  const country = constants.countries.find(countryMapping =>
    caseInsensitiveComparison(countryMapping.value, countryValue),
  );
  return country ? country.label : countryValue;
};

export { caseInsensitiveComparison, nameToValue, valueToName };
