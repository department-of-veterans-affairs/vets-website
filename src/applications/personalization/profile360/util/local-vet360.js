import { uniqueId } from 'lodash';
import * as VET360_CONSTANTS from '../constants/vet360';

export function isVet360Configured() {
  return document.location.hostname !== 'localhost';
}

export default {
  createTransaction() {
    return {
      data: {
        attributes: {
          transactionId: uniqueId('transaction_'),
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.RECEIVED
        }
      }
    };
  },
  updateTransaction(transactionId) {
    return {
      data: {
        attributes: {
          transactionId,
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.COMPLETED_SUCCESS
        }
      }
    };
  }
};

