import constants from 'vets-json-schema/dist/constants.json';

export const COUNTRY_CODES = constants.countries.map(country => country.label);

export const STATE_LABELS = constants.pciuStates.map(state => state.label);
export const STATE_VALUES = constants.pciuStates.map(state => state.value);

export const MILITARY_CITY_CODES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];

export const SCHEMA_DEFINITIONS = {
  phone: {
    type: 'string',
    pattern: '^\\d{10}$',
  },
  email: {
    type: 'string',
    minLength: 6,
    maxLength: 80,
    pattern:
      '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
  },
  address: {
    type: 'string',
    maxLength: 20,
    pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
  },
  city: {
    type: 'string',
    maxLength: 30,
    pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
  },
  zipCode: {
    type: 'string',
    pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
  },
};
