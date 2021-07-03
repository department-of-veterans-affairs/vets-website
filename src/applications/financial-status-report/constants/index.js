import { pciuStates, countries } from 'vets-json-schema/dist/constants.json';

export const COUNTRY_LABELS = countries.map(country => country.label);
export const COUNTRY_VALUES = countries.map(country => country.value);

export const STATE_LABELS = pciuStates.map(state => state.label);
export const STATE_VALUES = pciuStates.map(state => state.value);

export const MILITARY_CITY_CODES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];

export const SCHEMA_DEFINITIONS = {
  address: {
    type: 'string',
    pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
  },
  city: {
    type: 'string',
    pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
  },
  postalCode: {
    type: 'string',
    pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
  },
};
