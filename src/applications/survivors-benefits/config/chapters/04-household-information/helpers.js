import constants from 'vets-json-schema/dist/constants.json';

// Get military states to filter them out
export const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);

// Get states from the same source as the addressUI component
export const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);
export const STATE_VALUES = filteredStates.map(state => state.value);
export const STATE_NAMES = filteredStates.map(state => state.label);

// Get countries from the same source as the addressUI component
export const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);
export const COUNTRY_NAMES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.label);
