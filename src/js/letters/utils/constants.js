// Action types
export const BACKEND_AUTHENTICATION_ERROR = 'BACKEND_AUTHENTICATION_ERROR'; // 403
export const BACKEND_SERVICE_ERROR = 'BACKEND_SERVICE_ERROR'; // 503 or 504
export const INVALID_ADDRESS_PROPERTY = 'INVALID_ADDRESS_PROPERTY'; // 422
export const GET_LETTERS_FAILURE = 'GET_LETTERS_FAILURE';
export const GET_LETTERS_SUCCESS = 'GET_LETTERS_SUCCESS';
export const GET_ADDRESS_FAILURE = 'GET_ADDRESS_FAILURE';
export const GET_ADDRESS_SUCCESS = 'GET_ADDRESS_SUCCESS';
export const GET_BENEFIT_SUMMARY_OPTIONS_FAILURE = 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE';
export const GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS = 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS';
export const GET_LETTER_PDF_FAILURE = 'GET_LETTER_PDF_FAILURE';
export const GET_LETTER_PDF_SUCCESS = 'GET_LETTER_PDF_SUCCESS';
export const LETTER_ELIGIBILITY_ERROR = 'LETTER_ELIGIBILITY_ERROR';
export const UPDATE_BENFIT_SUMMARY_REQUEST_OPTION = 'UPDATE_BENFIT_SUMMARY_REQUEST_OPTION';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';

// TODO: copy in names from list sent by EVSS
export const STATE_CODE_TO_NAME = {
  AL: 'Alabama',
  AK: '',
  AZ: '',
  AR: '',
  CA: '',
  CO: '',
  CT: '',
  DE: '',
  FL: '',
  GA: '',
  HI: '',
  ID: '',
  IL: '',
  IN: '',
  IA: '',
  KS: '',
  KY: '',
  LA: '',
  ME: '',
  MD: '',
  MA: '',
  MI: '',
  MN: '',
  MS: '',
  MO: '',
  MT: '',
  NE: '',
  NV: '',
  NH: '',
  NJ: '',
  NM: '',
  NY: '',
  NC: '',
  ND: '',
  OH: '',
  OK: '',
  OR: '',
  PA: '',
  RI: '',
  SC: '',
  SD: '',
  TN: '',
  TX: '',
  UT: '',
  VT: '',
  VA: '',
  WA: '',
  WV: '',
  WI: '',
  WY: '',
  AS: '',
  DC: '',
  FM: '',
  GU: '',
  MH: '',
  MP: '',
  PW: '',
  PR: '',
  UM: '',
  VI: '',
  PI: ''
};
