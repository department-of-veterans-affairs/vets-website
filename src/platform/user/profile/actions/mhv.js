import { apiRequest } from '../../../utilities/api';

export const FETCHING_MHV_ACCOUNT = 'FETCHING_MHV_ACCOUNT';
export const FETCH_MHV_ACCOUNT_FAILURE = 'FETCH_MHV_ACCOUNT_FAILURE';
export const FETCH_MHV_ACCOUNT_SUCCESS = 'FETCH_MHV_ACCOUNT_SUCCESS';

const baseUrl = '/mhv_account';

export function fetchMHVAccount() {
  return dispatch => {
    dispatch({ type: FETCHING_MHV_ACCOUNT });

    apiRequest(baseUrl)
      .then(({ data }) => dispatch({ type: FETCH_MHV_ACCOUNT_SUCCESS, data }))
      .catch(({ errors = {} }) =>
        dispatch({ type: FETCH_MHV_ACCOUNT_FAILURE, errors }),
      );
  };
}
