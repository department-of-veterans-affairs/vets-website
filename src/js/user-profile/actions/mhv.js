import { apiRequest } from '../../common/helpers/api';

const FETCHING_MHV_ACCOUNT = 'FETCHING_MHV_ACCOUNT';
const FETCH_MHV_ACCOUNT_FAILURE = 'FETCH_MHV_ACCOUNT_FAILURE';
const FETCH_MHV_ACCOUNT_SUCCESS = 'FETCH_MHV_ACCOUNT_SUCCESS';
const CREATING_MHV_ACCOUNT = 'CREATING_MHV_ACCOUNT';
const CREATE_MHV_ACCOUNT_FAILURE = 'CREATE_MHV_ACCOUNT_FAILURE';
const CREATE_MHV_ACCOUNT_SUCCESS = 'CREATE_MHV_ACCOUNT_SUCCESS';

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
      () => dispatch({ type: CREATE_MHV_ACCOUNT_SUCCESS }),
      ({ errors }) => dispatch({ type: CREATE_MHV_ACCOUNT_FAILURE, errors })
    );
  };
}
