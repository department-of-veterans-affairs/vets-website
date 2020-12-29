import { pciuStates, countries } from 'vets-json-schema/dist/constants.json';

export const COUNTRY_CODES = countries.map(country => country.label);

export const STATE_LABELS = pciuStates.map(state => state.label);
export const STATE_VALUES = pciuStates.map(state => state.value);

export const MILITARY_CITY_CODES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];
