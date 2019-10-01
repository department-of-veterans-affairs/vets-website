// This file was created to hold redundant or multi-use functions to be used elsewhere in the reducers

export const normalizedAttributes = attributes => {
  const name = attributes.name
    ? attributes.name.toUpperCase()
    : attributes.name;
  const city = attributes.physicalCity
    ? attributes.physicalCity.toUpperCase()
    : attributes.physicalCity;
  const state = attributes.physicalState
    ? attributes.physicalState.toUpperCase()
    : attributes.physicalState;
  const country = attributes.physicalCountry
    ? attributes.physicalCountry.toUpperCase()
    : attributes.physicalCountry;
  const zip = attributes.physicalZip
    ? attributes.physicalZip.toUpperCase()
    : attributes.physicalZip;
  return {
    ...attributes,
    name,
    city,
    state,
    country,
    zip,
  };
};
