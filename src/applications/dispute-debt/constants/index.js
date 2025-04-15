export const TITLE = 'Dispute your VA debt';
export const SUBTITLE = 'Process to dispute debt';

// Date formats
export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';

// Debt deduction codes
export const deductionCodes = Object.freeze({
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
});

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';

export const DEBT_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});
