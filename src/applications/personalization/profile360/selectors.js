import {
  isSuccessfulTransaction,
  isFailedTransaction,
  isErroredUpdateTransaction
} from './util/transactions';

export function selectVet360Field(state, fieldName) {
  return state.user.profile.vet360[fieldName];
}

export function selectVet360Transaction(state, fieldName) {
  const {
    vet360: {
      transactions,
      fieldTransactionMap: {
        [fieldName]: transactionRequest
      }
    }
  } = state;

  let transaction = null;

  if (transactionRequest && transactionRequest.transactionId) {
    transaction = transactions.find(t => t.data.attributes.transactionId === transactionRequest.transactionId);
  }

  return {
    transactionRequest,
    transaction
  };
}

export function selectVet360SuccessfulTransactions(state) {
  return state.vet360.transactions.filter(isSuccessfulTransaction);
}

export function selectVet360ErroredTransactions(state) {
  return state.vet360.transactions.filter(transaction => {
    return isFailedTransaction(transaction) || isErroredUpdateTransaction(transaction);
  });
}

export function selectEditedFormField(state, fieldName) {
  return state.vaProfile.formFields[fieldName];
}

export function selectCurrentlyOpenEditModal(state) {
  return state.vaProfile.modal;
}
