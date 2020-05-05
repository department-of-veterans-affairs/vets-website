import { apiRequest } from 'platform/utilities/api';

export * from 'platform/user/profile/actions';

export const LOADING_CONNECTED_ACCOUNTS = 'LOADING_CONNECTED_ACCOUNTS';
export const FINISHED_CONNECTED_ACCOUNTS = 'FINISHED_CONNECTED_ACCOUNTS';
export const ERROR_CONNECTED_ACCOUNTS = 'ERROR_CONNECTED_ACCOUNTS';
export const DELETING_CONNECTED_ACCOUNT = 'DELETING_CONNECTED_ACCOUNT';
export const ERROR_DELETING_CONNECTED_ACCOUNT =
  'ERROR_DELETING_CONNECTED_ACCOUNT';
export const FINISHED_DELETING_CONNECTED_ACCOUNT =
  'FINISHED_DELETING_CONNECTED_ACCOUNT';
export const DELETED_ACCOUNT_ALERT_DISMISSED =
  'DELETED_ACCOUNT_ALERT_DISMISSED';

const grantsUrl = '/profile/connected_applications';

export function loadConnectedAccounts() {
  return async dispatch => {
    dispatch({ type: 'LOADING_CONNECTED_ACCOUNTS' });

    return apiRequest(grantsUrl)
      .then(({ data }) => dispatch({ type: FINISHED_CONNECTED_ACCOUNTS, data }))
      .catch(({ errors }) =>
        dispatch({ type: ERROR_CONNECTED_ACCOUNTS, errors }),
      );
  };
}

export function deleteConnectedAccount(accountId) {
  return async dispatch => {
    dispatch({ type: DELETING_CONNECTED_ACCOUNT, accountId });

    return apiRequest(`${grantsUrl}/${accountId}`, { method: 'DELETE' })
      .then(() =>
        dispatch({ type: FINISHED_DELETING_CONNECTED_ACCOUNT, accountId }),
      )
      .catch(({ errors }) =>
        dispatch({ type: ERROR_DELETING_CONNECTED_ACCOUNT, accountId, errors }),
      );
  };
}

export function dismissDeletedAccountAlert(accountId) {
  return async dispatch =>
    dispatch({ type: DELETED_ACCOUNT_ALERT_DISMISSED, accountId });
}
