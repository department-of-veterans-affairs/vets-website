import backendServices from '../../../../platform/user/profile/constants/backendServices';

import { VET360_INITIALIZATION_STATUS, INIT_VET360_ID } from './constants';

import { isVet360Configured } from './util/local-vet360';

import { isFailedTransaction, isPendingTransaction } from './util/transactions';

export function selectIsVet360AvailableForUser(state) {
  if (!isVet360Configured()) return true; // returns true if on localhost
  return state.user.profile.services.includes(backendServices.VET360);
}

export function selectVet360Field(state, fieldName) {
  return state.user.profile.vet360[fieldName];
}

export function selectVet360Transaction(state, fieldName) {
  const {
    vet360: {
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

export function selectVet360FailedTransactions(state) {
  return state.vet360.transactions.filter(isFailedTransaction);
}

export function selectMostRecentErroredTransaction(state) {
  const {
    vet360: {
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

export function selectVet360PendingCategoryTransactions(state, type) {
  const {
    vet360: { transactions, fieldTransactionMap },
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
  return state.vet360.formFields[fieldName];
}

export function selectCurrentlyOpenEditModal(state) {
  return state.vet360.modal;
}

export function selectVet360InitializationStatus(state) {
  let status = VET360_INITIALIZATION_STATUS.UNINITALIZED;

  const { transaction, transactionRequest } = selectVet360Transaction(
    state,
    INIT_VET360_ID,
  );
  const isReady = selectIsVet360AvailableForUser(state);
  let isPending = false;
  let isFailure = false;

  if (transactionRequest) {
    isPending =
      transactionRequest.isPending ||
      (transaction && isPendingTransaction(transaction));
    isFailure =
      transactionRequest.isFailed ||
      (transaction && isFailedTransaction(transaction));
  }

  if (isReady) {
    status = VET360_INITIALIZATION_STATUS.INITIALIZED;
  } else if (isPending) {
    status = VET360_INITIALIZATION_STATUS.INITIALIZING;
  } else if (isFailure) {
    status = VET360_INITIALIZATION_STATUS.INITIALIZATION_FAILURE;
  }

  return {
    status,
    transaction,
    transactionRequest,
  };
}
