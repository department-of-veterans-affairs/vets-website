import { militaryStates, territories } from './constants';

export function countryNameToValue(countryName) {
  if (countryName === 'UNITED STATES') {
    return 'USA';
  }
  // Add more country name mappings if needed
  return countryName;
}

export function isMilitaryState(state) {
  return militaryStates.includes(state);
}

export function isTerritory(country) {
  return territories.includes(country);
}
