import constants from 'vets-json-schema/dist/constants.json';

const nameToValue = countryName => {
  const country = constants.countries.find(
    countryMapping => countryMapping.label === countryName,
  );
  return country ? country.value : countryName;
};

const valueToName = countryValue => {
  const country = constants.countries.find(
    countryMapping => countryMapping.value === countryValue,
  );
  return country ? country.label : countryValue;
};

export { nameToValue, valueToName };
