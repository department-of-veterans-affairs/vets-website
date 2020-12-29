import { pciuStates as PCIU_STATES } from 'vets-json-schema/dist/constants.json';

export const STATE_LABELS = PCIU_STATES.map(state => state.label);
export const STATE_VALUES = PCIU_STATES.map(state => state.value);

export const MILITARY_CITY_CODES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];
