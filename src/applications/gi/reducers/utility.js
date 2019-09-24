// This file was created to hold redundant or multi-use functions to be used elsewhere in the reducers

function normalizedAttributes(attributes) {
  const name = attributes.name
    ? attributes.name.toUpperCase()
    : attributes.name;
  const city = attributes.physicalCity
    ? attributes.physicalCity.toUpperCase()
    : attributes.physicalCity;
  const state = attributes.physicalState
    ? attributes.physicalState.toUpperCase()
    : attributes.physicalState;
  return {
    ...attributes,
    name,
    city,
    state,
  };
}

export default normalizedAttributes;
