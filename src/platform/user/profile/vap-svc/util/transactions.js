import * as VAP_SERVICE from '../constants';

export const PENDING_STATUSES = new Set([
  VAP_SERVICE.TRANSACTION_STATUS.RECEIVED,
  VAP_SERVICE.TRANSACTION_STATUS.RECEIVED_DEAD_LETTER_QUEUE,
  VAP_SERVICE.TRANSACTION_STATUS.RECEIVED_ERROR_QUEUE,
]);

export const SUCCESS_STATUSES = new Set([
  VAP_SERVICE.TRANSACTION_STATUS.COMPLETED_SUCCESS,
  VAP_SERVICE.TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED,
]);

export const FAILURE_STATUSES = new Set([
  VAP_SERVICE.TRANSACTION_STATUS.COMPLETED_FAILURE,
  VAP_SERVICE.TRANSACTION_STATUS.REJECTED,
]);

export const VA_PROFILE_INIT_ERROR_CODES = new Set(['CORE100']);

export const UPDATE_ERROR_CODES = new Set([
  'ADDR200',
  'ADDR201',
  'EMAIL200',
  'EMAIL201',
  'PHON124',
  'PHON125',
  'CORE101',
  'CORE102',
  'CORE105',
  'CORE106',
  'CORE107',
  'CORE109',
  'CORE110',
  'CORE500',
  'CORE501',
  'CORE502',
]);

export const MVI_NOT_FOUND_ERROR_CODES = new Set(['MVI201']);

export const MVI_ERROR_CODES = new Set([
  'MVI100',
  'MVI101',
  'MVI200',
  'MVI202',
  'MVI203',
]);

// This results as a direct error response from the API, and prior to a transaction being created.
// For context - https://github.com/department-of-veterans-affairs/vets.gov-team/issues/11352
export const LOW_CONFIDENCE_ADDRESS_ERROR_CODES = new Set([
  'ADDR305',
  'ADDR306',
  'ADDR307',
]);

export const DECEASED_ERROR_CODES = new Set(['MVI300']);

export const INVALID_EMAIL_ADDRESS_ERROR_CODES = new Set([
  'EMAIL304',
  'EMAIL305',
  'VET360_EMAIL304',
  'VET360_EMAIL305',
]);

export const INVALID_PHONE_ERROR_CODES = new Set([
  'PHON126',
  'PHON211',
  'PHON213',
  'VET360_PHON126', // Phone area code pattern must match "[0-9]+"
  'VET360_PHON211', // New: Area Codes do not end with the same two digits
  'VET360_PHON213', // New: Area Codes do not include 9 as the middle digit
]);

export function isPendingTransaction(transaction) {
  return PENDING_STATUSES.has(transaction?.data.attributes.transactionStatus);
}

export function isSuccessfulTransaction(transaction) {
  return SUCCESS_STATUSES.has(transaction?.data.attributes.transactionStatus);
}

export function isFailedTransaction(transaction) {
  return FAILURE_STATUSES.has(transaction?.data.attributes.transactionStatus);
}

function matchErrorCode(codeSet, transaction) {
  // Create a codeSet that contains all the values of the passed-in codeSet,
  // with and without a `VET360_` prefix. The `VET360_` prefix is added by our
  // vets-api layer, but is only added in some cases.
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/8847#issuecomment-635992074
  const hydratedCodeSet = new Set(
    Array.from(codeSet).reduce((codes, code) => {
      codes.push(code);
      codes.push(`VET360_${code}`);
      return codes;
    }, []),
  );
  const { metadata } = transaction?.data?.attributes;
  return metadata?.some(error => hydratedCodeSet.has(error.code));
}

export function hasGenericUpdateError(transaction) {
  return matchErrorCode(UPDATE_ERROR_CODES, transaction);
}

export function hasMVINotFoundError(transaction) {
  return matchErrorCode(MVI_NOT_FOUND_ERROR_CODES, transaction);
}

export function hasVAProfileInitError(transaction) {
  return matchErrorCode(VA_PROFILE_INIT_ERROR_CODES, transaction);
}

export function hasMVIError(transaction) {
  return matchErrorCode(MVI_ERROR_CODES, transaction);
}

export function hasUserIsDeceasedError(transaction) {
  return matchErrorCode(DECEASED_ERROR_CODES, transaction);
}
