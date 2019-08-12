import * as VET360 from '../constants';

export const PENDING_STATUSES = new Set([
  VET360.TRANSACTION_STATUS.RECEIVED,
  VET360.TRANSACTION_STATUS.RECEIVED_DEAD_LETTER_QUEUE,
  VET360.TRANSACTION_STATUS.RECEIVED_ERROR_QUEUE,
]);

export const SUCCESS_STATUSES = new Set([
  VET360.TRANSACTION_STATUS.COMPLETED_SUCCESS,
  VET360.TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED,
]);

export const FAILURE_STATUSES = new Set([
  VET360.TRANSACTION_STATUS.COMPLETED_FAILURE,
  VET360.TRANSACTION_STATUS.REJECTED,
]);

export const UPDATE_ERROR_CODES = new Set([
  'VET360_ADDR200',
  'VET360_ADDR201',
  'VET360_EMAIL200',
  'VET360_EMAIL201',
  'VET360_PHON124',
  'VET360_PHON125',
  'VET360_CORE100',
  'VET360_CORE101',
  'VET360_CORE102',
  'VET360_CORE105',
  'VET360_CORE106',
  'VET360_CORE107',
  'VET360_CORE109',
  'VET360_CORE110',
  'VET360_CORE500',
  'VET360_CORE501',
  'VET360_CORE502',
]);

export const MVI_NOT_FOUND_ERROR_CODES = new Set(['VET360_MVI201']);

export const MVI_ERROR_CODES = new Set([
  'VET360_MVI100',
  'VET360_MVI101',
  'VET360_MVI200',
  'VET360_MVI202',
  'VET360_MVI203',
]);

// This results as a direct error response from the API, and prior to a transaction being created.
// For context - https://github.com/department-of-veterans-affairs/vets.gov-team/issues/11352
export const LOW_CONFIDENCE_ADDRESS_ERROR_CODES = new Set([
  'VET360_ADDR305',
  'VET360_ADDR306',
  'VET360_ADDR307',
]);

export const DECEASED_ERROR_CODES = new Set(['VET360_MVI300']);

export function isPendingTransaction(transaction) {
  return PENDING_STATUSES.has(transaction.data.attributes.transactionStatus);
}

export function isSuccessfulTransaction(transaction) {
  return SUCCESS_STATUSES.has(transaction.data.attributes.transactionStatus);
}

export function isFailedTransaction(transaction) {
  return FAILURE_STATUSES.has(transaction.data.attributes.transactionStatus);
}

function matchErrorCode(codeSet, transaction) {
  const { metadata } = transaction.data.attributes;
  return metadata && metadata.some(error => codeSet.has(error.code));
}

export function hasGenericUpdateError(transaction) {
  return matchErrorCode(UPDATE_ERROR_CODES, transaction);
}

export function hasMVINotFoundError(transaction) {
  return matchErrorCode(MVI_NOT_FOUND_ERROR_CODES, transaction);
}

export function hasMVIError(transaction) {
  return matchErrorCode(MVI_ERROR_CODES, transaction);
}

export function hasUserIsDeceasedError(transaction) {
  return matchErrorCode(DECEASED_ERROR_CODES, transaction);
}
