import {
  VET360_TRANSACTIONS_FETCH_SUCCESS,
  VET360_TRANSACTION_REQUESTED,
  VET360_TRANSACTION_REQUEST_SUCCEEDED,
  VET360_TRANSACTION_REQUEST_FAILED,
  VET360_TRANSACTION_UPDATED,
  VET360_TRANSACTION_CLEARED,
  VET360_TRANSACTION_REQUEST_CLEARED,
  VET360_TRANSACTION_UPDATE_REQUESTED,
  VET360_TRANSACTION_UPDATE_FAILED
} from '../actions';

import {
  isFailedTransaction,
  isSuccessfulTransaction
} from '../util/transactions';

const initialState = {
  transactions: [],
  fieldTransactionMap: {},
  transactionsAwaitingUpdate: [],
  metadata: {
    mostRecentSuccessfulTransactionId: '',
    mostRecentErroredTransactionId: '',
  }
};

export default function vet360(state = initialState, action) {
  switch (action.type) {

    case VET360_TRANSACTIONS_FETCH_SUCCESS: {
      const transactions = action.data.map((transactionData) => {
        // Wrap in a "data" property to imitate the API response for a single transaction
        return { data: transactionData };
      });
      return {
        ...state,
        transactions
      };
    }

    case VET360_TRANSACTION_REQUESTED:
      return {
        ...state,
        fieldTransactionMap: {
          ...state.fieldTransactionMap,
          [action.fieldName]: {
            isPending: true,
            method: action.method
          }
        }
      };

    case VET360_TRANSACTION_REQUEST_FAILED:
      return {
        ...state,
        fieldTransactionMap: {
          ...state.fieldTransactionMap,
          [action.fieldName]: {
            ...state.fieldTransactionMap[action.fieldName],
            isPending: false,
            isFailed: true,
            error: action.error
          }
        }
      };

    case VET360_TRANSACTION_REQUEST_SUCCEEDED: {
      return {
        ...state,
        transactions: state.transactions.concat(action.transaction),
        fieldTransactionMap: {
          ...state.fieldTransactionMap,
          [action.fieldName]: {
            ...state.fieldTransactionMap[action.fieldName],
            isPending: false,
            transactionId: action.transaction.data.attributes.transactionId
          }
        }
      };
    }

    case VET360_TRANSACTION_UPDATE_REQUESTED: {
      const { transactionId } = action.transaction.data.attributes;
      return {
        ...state,
        transactionsAwaitingUpdate: state.transactionsAwaitingUpdate.concat(transactionId)
      };
    }

    case VET360_TRANSACTION_UPDATED: {
      const { transaction } = action;
      const { transactionId: updatedTransactionId } = transaction.data.attributes;

      const metadata = { ...state.metadata };
      if (isFailedTransaction(transaction)) {
        metadata.mostRecentErroredTransactionId = updatedTransactionId;
      } else if (isSuccessfulTransaction(transaction)) {
        metadata.mostRecentSuccessfulTransactionId = updatedTransactionId;
      }

      return {
        ...state,
        metadata,
        transactionsAwaitingUpdate: state.transactionsAwaitingUpdate.filter(tid => tid !== updatedTransactionId),
        transactions: state.transactions.map(t => {
          return t.data.attributes.transactionId === updatedTransactionId ? transaction : t;
        })
      };
    }

    case VET360_TRANSACTION_UPDATE_FAILED: {
      const { transactionId } = action.transaction.data.attributes;
      return {
        ...state,
        transactionsAwaitingUpdate: state.transactionsAwaitingUpdate.filter(tid => tid !== transactionId)
      };
    }

    case VET360_TRANSACTION_CLEARED: {
      const finishedTransactionId =  action.transaction.data.attributes.transactionId;
      const fieldTransactionMap = { ...state.fieldTransactionMap };

      Object.keys(fieldTransactionMap).forEach((field) => {
        const transactionRequest = fieldTransactionMap[field];
        if (transactionRequest && transactionRequest.transactionId === finishedTransactionId) {
          delete fieldTransactionMap[field];
        }
      });

      const metadata = { ...state.metadata };
      if (metadata.mostRecentSuccessfulTransactionId === finishedTransactionId) {
        metadata.mostRecentSuccessfulTransactionId = null;
      } else if (metadata.mostRecentErroredTransactionId === finishedTransactionId) {
        metadata.mostRecentErroredTransactionId = null;
      }

      return {
        ...state,
        metadata,
        transactions: state.transactions.filter(t => t.data.attributes.transactionId !== finishedTransactionId),
        fieldTransactionMap
      };
    }

    case VET360_TRANSACTION_REQUEST_CLEARED: {
      const fieldTransactionMap = { ...state.fieldTransactionMap };
      delete fieldTransactionMap[action.fieldName];

      return {
        ...state,
        fieldTransactionMap
      };
    }

    default:
      return state;
  }
}
