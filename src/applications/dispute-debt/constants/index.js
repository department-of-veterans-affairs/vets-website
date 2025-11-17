export const TITLE = 'Dispute your VA debt';

// currently only 2, but could be expanded in the future?
export const DISPUTE_REASONS = {
  EXISTENCE: `I don't think I owe this debt to VA`,
  AMOUNT: `I don't think the amount is correct on this debt`,
};

// Date formats
export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';

// Debt deduction codes
export const deductionCodes = Object.freeze({
  '11': 'Post-9/11 GI Bill overpayment for books and supplies',
  '12': 'Post-9/11 GI Bill overpayment for books and supplies',
  '13': 'Post-9/11 GI Bill overpayment for books and supplies',
  '14': 'Post-9/11 GI Bill overpayment for books and supplies',
  '15': 'Post-9/11 GI Bill overpayment for books and supplies',
  '16': 'Post-9/11 GI Bill overpayment for housing',
  '17': 'Post-9/11 GI Bill overpayment for housing',
  '18': 'Post-9/11 GI Bill overpayment for housing',
  '19': 'Post-9/11 GI Bill overpayment for housing',
  '20': 'Post-9/11 GI Bill overpayment for housing',
  '27': 'Post-9/11 GI Bill overpayment for books and supplies',
  '28': 'Post-9/11 GI Bill overpayment for books and supplies',
  '30': 'Disability compensation and pension overpayment',
  '41': 'Chapter 34 education overpayment',
  '44': 'Chapter 35 education overpayment',
  '48': 'Post-9/11 GI Bill overpayment for housing',
  '49': 'Post-9/11 GI Bill overpayment for housing',
  '50': 'Post-9/11 GI Bill overpayment for housing',
  '51': 'Post-9/11 GI Bill overpayment for housing',
  '71': 'Post-9/11 GI Bill overpayment for books and supplies',
  '72': 'Post-9/11 GI Bill overpayment for housing',
  '73': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '74': 'Post-9/11 GI Bill overpayment for tuition',
  '75': 'Post-9/11 GI Bill overpayment for tuition (school liable)',
  '76': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '77': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '78': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '79': 'Education Ch 33-Ch1606/Ch30 Kickers',
});

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';

export const DEBT_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});
