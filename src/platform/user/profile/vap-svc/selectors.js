import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  selectAvailableServices,
  selectVAPContactInfo,
} from '~/platform/user/selectors';

import {
  VAP_SERVICE_INITIALIZATION_STATUS,
  INIT_VAP_SERVICE_ID,
} from './constants';

import { isVAProfileServiceConfigured } from './util/local-vapsvc';

import { isFailedTransaction, isPendingTransaction } from './util/transactions';

export function selectIsVAProfileServiceAvailableForUser(state) {
  if (!isVAProfileServiceConfigured()) return true; // returns true if on localhost
  return selectAvailableServices(state).includes(backendServices.VA_PROFILE);
}

export function selectVAPContactInfoField(state, fieldName) {
  return selectVAPContactInfo(state)[fieldName];
}

export function selectVAPServiceTransaction(state, fieldName) {
  const {
    vapService: {
      transactions,
      fieldTransactionMap: { [fieldName]: transactionRequest = null },
    },
  } = state;

  let transaction = null;

  if (transactionRequest && transactionRequest.transactionId) {
    transaction = transactions.find(
      t => t.data.attributes.transactionId === transactionRequest.transactionId,
    );
  }

  return {
    transactionRequest,
    transaction,
  };
}

export function selectVAPServiceFailedTransactions(state) {
  return state.vapService.transactions.filter(isFailedTransaction);
}

export function selectMostRecentErroredTransaction(state) {
  const {
    vapService: {
      transactions,
      metadata: { mostRecentErroredTransactionId },
    },
  } = state;

  let transaction = null;
  if (mostRecentErroredTransactionId) {
    transaction = transactions.find(
      t => t.data.attributes.transactionId === mostRecentErroredTransactionId,
    );
  }
  return transaction;
}

export function selectVAPServicePendingCategoryTransactions(state, type) {
  const {
    vapService: { transactions, fieldTransactionMap },
  } = state;

  const existsWithinFieldTransactionMap = transaction => {
    const transactionId = transaction.data.attributes.transactionId;

    return Object.keys(fieldTransactionMap).some(fieldName => {
      const transactionRequest = fieldTransactionMap[fieldName];
      return transactionRequest.transactionId === transactionId;
    });
  };

  return transactions
    .filter(
      transaction =>
        // Do the actual category-type filter.
        transaction.data.attributes.type === type,
    )
    .filter(transaction =>
      // Filter to transaction with the pending status
      isPendingTransaction(transaction),
    )
    .filter(
      transaction =>
        // If the transaction has corresponding transaction information in the fieldTransactionMap,
        // then we know which field that transaction belongs. In this case, we ignore it at the
        // category-level.
        !existsWithinFieldTransactionMap(transaction),
    );
}

export function selectEditedFormField(state, fieldName) {
  return state.vapService.formFields[fieldName];
}

export function selectCurrentlyOpenEditModal(state) {
  return state.vapService.modal;
}

export function selectAddressValidation(state) {
  return state.vapService?.addressValidation || {};
}

export function selectAddressValidationType(state) {
  return selectAddressValidation(state).addressValidationType;
}

export function selectVAPServiceInitializationStatus(state) {
  let status = VAP_SERVICE_INITIALIZATION_STATUS.UNINITIALIZED;

  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    INIT_VAP_SERVICE_ID,
  );
  const isReady = selectIsVAProfileServiceAvailableForUser(state);
  let isPending = false;
  let isFailure = false;

  if (transactionRequest) {
    isPending =
      transactionRequest.isPending || isPendingTransaction(transaction);
    isFailure = transactionRequest.isFailed || isFailedTransaction(transaction);
  }

  if (isReady) {
    status = VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED;
  } else if (isPending) {
    status = VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZING;
  } else if (isFailure) {
    status = VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZATION_FAILURE;
  }

  return {
    status,
    transaction,
    transactionRequest,
  };
}
