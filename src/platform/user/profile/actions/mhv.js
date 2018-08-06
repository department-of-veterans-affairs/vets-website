import { apiRequest } from '../../../utilities/api';

export const FETCHING_MHV_ACCOUNT = 'FETCHING_MHV_ACCOUNT';
export const FETCH_MHV_ACCOUNT_FAILURE = 'FETCH_MHV_ACCOUNT_FAILURE';
export const FETCH_MHV_ACCOUNT_SUCCESS = 'FETCH_MHV_ACCOUNT_SUCCESS';

export const CREATING_MHV_ACCOUNT = 'CREATING_MHV_ACCOUNT';
export const CREATE_MHV_ACCOUNT_FAILURE = 'CREATE_MHV_ACCOUNT_FAILURE';
export const CREATE_MHV_ACCOUNT_SUCCESS = 'CREATE_MHV_ACCOUNT_SUCCESS';

export const UPGRADING_MHV_ACCOUNT = 'UPGRADING_MHV_ACCOUNT';
export const UPGRADE_MHV_ACCOUNT_FAILURE = 'UPGRADE_MHV_ACCOUNT_FAILURE';
export const UPGRADE_MHV_ACCOUNT_SUCCESS = 'UPGRADE_MHV_ACCOUNT_SUCCESS';

const baseUrl = '/mhv_account';

export function fetchMHVAccount() {
  return dispatch => {
    dispatch({ type: FETCHING_MHV_ACCOUNT });

    apiRequest(
      baseUrl,
      null,
      ({ data }) => dispatch({ type: FETCH_MHV_ACCOUNT_SUCCESS, data }),
      ({ errors }) => dispatch({ type: FETCH_MHV_ACCOUNT_FAILURE, errors })
    );
  };
}

export function createMHVAccount() {
  return dispatch => {
    dispatch({ type: CREATING_MHV_ACCOUNT });

    apiRequest(
      baseUrl,
      { method: 'POST' },
      ({ data }) => dispatch({ type: CREATE_MHV_ACCOUNT_SUCCESS, data }),
      () => dispatch({ type: CREATE_MHV_ACCOUNT_FAILURE })
    );
  };
}

export function upgradeMHVAccount() {
  return dispatch => {
    dispatch({ type: UPGRADING_MHV_ACCOUNT });

    apiRequest(
      `${baseUrl}/upgrade`,
      { method: 'POST' },
      ({ data }) => dispatch({ type: UPGRADE_MHV_ACCOUNT_SUCCESS, data }),
      () => dispatch({ type: UPGRADE_MHV_ACCOUNT_FAILURE })
    );
  };
}
