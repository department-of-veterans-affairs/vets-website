export const APP_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});

export const ALERT_TYPES = Object.freeze({
  ALL_ERROR: 'ALL_ERROR',
  ALL_ZERO: 'ALL_ZERO',
  ERROR: 'ERROR',
  ZERO: 'ZERO',
});

export const API_RESPONSES = Object.freeze({
  ERROR: -1,
});

export const DEFAULT_COPAY_ATTRIBUTES = Object.freeze({
  TITLE: 'title',
  INVOICE_DATE: 'invoiceDate',
  ACCOUNT_NUMBER: 'accountNumber',
  FACILITY_NAME: 'facilityName',
  CHARGES: [],
  AMOUNT_DUE: 0.0,
});

export const DEFAULT_STATEMENT_ATTRIBUTES = Object.freeze({
  LATEST_COPAY: {},
  TITLE: '',
  DATE: '',
  PREV_PAGE: '',
  ACCOUNT_NUMBER: '',
  CHARGES: [],
  CURRENT_BALANCE: 0.0,
  PAYMENTS_RECEIVED: 0.0,
});

export const RESOLVE_HEADER = `Resolve your copay bill`;
