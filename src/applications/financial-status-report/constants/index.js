import constants from 'vets-json-schema/dist/constants.json';

export const COUNTRY_LABELS = constants.countries.map(country => country.label);
export const COUNTRY_VALUES = constants.countries.map(country => country.value);

export const STATE_LABELS = constants.pciuStates.map(state => state.label);
export const STATE_VALUES = constants.pciuStates.map(state => state.value);

export const MILITARY_CITY_CODES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];

export const RESOLUTION_OPTION_TYPES = Object.freeze({
  WAIVER: 'waiver',
  COMPROMISE: 'compromise',
  MONTHLY: 'monthly',
});

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

export const CONTACT_INFO_PATH = 'current-contact-information';
export const CONTACT_EDIT = 'edit-contact-info'; // contact info focusing
export const REVIEW_CONTACT = 'onReviewPageContact';

export const DEBT_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});

export const ALERT_TYPES = Object.freeze({
  ALL_ERROR: 'ALL_ERROR',
  ALL_ZERO: 'ALL_ZERO',
  ERROR: 'ERROR',
  ZERO: 'ZERO',
});

export const BASE_EMPLOYMENT_RECORD = {
  type: '',
  from: '',
  to: '',
  isCurrent: false,
  employerName: '',
  grossMonthlyIncome: '',
  deductions: [],
};
