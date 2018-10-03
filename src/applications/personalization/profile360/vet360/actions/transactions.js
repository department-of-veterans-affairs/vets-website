import { apiRequest } from '../../../../../platform/utilities/api';
import { refreshProfile } from '../../../../../platform/user/profile/actions';
import recordEvent from '../../../../../platform/monitoring/record-event';

import localVet360, { isVet360Configured } from '../util/local-vet360';
import {
  isSuccessfulTransaction,
  isFailedTransaction,
} from '../util/transactions';

export const VET360_TRANSACTIONS_FETCH_SUCCESS =
  'VET360_TRANSACTIONS_FETCH_SUCCESS';
export const VET360_TRANSACTION_REQUESTED = 'VET360_TRANSACTION_REQUESTED';
export const VET360_TRANSACTION_REQUEST_FAILED =
  'VET360_TRANSACTION_REQUEST_FAILED';
export const VET360_TRANSACTION_REQUEST_SUCCEEDED =
  'VET360_TRANSACTION_REQUEST_SUCCEEDED';
export const VET360_TRANSACTION_REQUEST_CLEARED =
  'VET360_TRANSACTION_REQUEST_CLEARED';
export const VET360_TRANSACTION_UPDATE_REQUESTED =
  'VET360_TRANSACTION_UPDATE_REQUESTED';
export const VET360_TRANSACTION_UPDATED = 'VET360_TRANSACTION_UPDATED';
export const VET360_TRANSACTION_UPDATE_FAILED =
  'VET360_TRANSACTION_UPDATE_FAILED';
export const VET360_TRANSACTION_CLEARED = 'VET360_TRANSACTION_CLEARED';

export function fetchTransactions() {
  return async dispatch => {
    try {
      let response;
      if (isVet360Configured()) {
        response = await apiRequest('/profile/status/');
      } else {
        response = { data: [] };
        // Uncomment the line below to simulate transactions being processed during initialization
        // response = localVet360.getUserTransactions();
      }
      dispatch({
        type: VET360_TRANSACTIONS_FETCH_SUCCESS,
        data: response.data,
      });
    } catch (err) {
      // If we sync transactions in the background and fail, is it worth telling the user?
    }
  };
}

export function clearTransaction(transaction) {
  return {
    type: VET360_TRANSACTION_CLEARED,
    transaction,
  };
}

export function clearTransactionRequest(fieldName) {
  return {
    type: VET360_TRANSACTION_REQUEST_CLEARED,
    fieldName,
  };
}

export function refreshTransaction(
  transaction,
  analyticsSectionName,
  _route = null,
) {
  return async (dispatch, getState) => {
    try {
      const { transactionId } = transaction.data.attributes;
      const state = getState();
      const isAlreadyAwaitingUpdate = state.vet360.transactionsAwaitingUpdate.includes(
        transactionId,
      );

      if (isAlreadyAwaitingUpdate) {
        return;
      }

      dispatch({
        type: VET360_TRANSACTION_UPDATE_REQUESTED,
        transaction,
      });

      const route = _route || `/profile/status/${transactionId}`;
      const transactionRefreshed = isVet360Configured()
        ? await apiRequest(route)
        : await localVet360.updateTransaction(transactionId);

      if (isSuccessfulTransaction(transactionRefreshed)) {
        const forceCacheClear = true;
        await dispatch(refreshProfile(forceCacheClear));
        dispatch(clearTransaction(transactionRefreshed));
        recordEvent({ event: 'profile-saved' });
      } else {
        dispatch({
          type: VET360_TRANSACTION_UPDATED,
          transaction: transactionRefreshed,
        });

        if (isFailedTransaction(transactionRefreshed) && analyticsSectionName) {
          recordEvent({
            event: 'profile-edit-failure',
            'profile-action': 'save-failure',
            'profile-section': analyticsSectionName,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: VET360_TRANSACTION_UPDATE_FAILED,
        transaction,
        err,
      });
    }
  };
}

export function createTransaction(
  route,
  method,
  fieldName,
  payload,
  analyticsSectionName,
) {
  return async dispatch => {
    const options = {
      body: JSON.stringify(payload),
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      dispatch({
        type: VET360_TRANSACTION_REQUESTED,
        fieldName,
        method,
      });

      const transaction = isVet360Configured()
        ? await apiRequest(route, options)
        : await localVet360.createTransaction();

      recordEvent({
        event: method === 'DELETE' ? 'profile-deleted' : 'profile-transaction',
        'profile-section': analyticsSectionName,
      });

      dispatch({
        type: VET360_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction,
      });
    } catch (error) {
      dispatch({
        type: VET360_TRANSACTION_REQUEST_FAILED,
        error,
        fieldName,
      });
    }
  };
}
