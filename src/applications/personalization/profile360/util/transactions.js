import * as VET360 from '../constants/vet360';

const SUCCESS_STATUSES = [
  VET360.TRANSACTION_STATUS.COMPLETED_SUCCESS,
  VET360.TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED
];

export function isTransactionCompletedSuccessfully(transaction) {
  return SUCCESS_STATUSES.includes(transaction.data.attributes.transactionStatus);
}
