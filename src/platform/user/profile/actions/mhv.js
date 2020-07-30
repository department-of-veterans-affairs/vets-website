import { apiRequest } from '../../../utilities/api';
import get from '../../../utilities/data/get';
import recordEvent from '../../../monitoring/record-event';

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

    apiRequest(baseUrl)
      .then(({ data }) => dispatch({ type: FETCH_MHV_ACCOUNT_SUCCESS, data }))
      .catch(({ errors = {} }) =>
        dispatch({ type: FETCH_MHV_ACCOUNT_FAILURE, errors }),
      );
  };
}

export function createMHVAccount() {
  return dispatch => {
    dispatch({ type: CREATING_MHV_ACCOUNT });
    recordEvent({ event: 'register-mhv-create-attempt' });

    return apiRequest(baseUrl, { method: 'POST' })
      .then(({ data }) => {
        recordEvent({ event: 'register-mhv-create-success' });
        return dispatch({ type: CREATE_MHV_ACCOUNT_SUCCESS, data });
      })
      .catch(() => dispatch({ type: CREATE_MHV_ACCOUNT_FAILURE }));
  };
}

export function upgradeMHVAccount() {
  return async dispatch => {
    dispatch({ type: UPGRADING_MHV_ACCOUNT });
    recordEvent({ event: 'register-mhv-upgrade-attempt' });

    let mhvAccount;
    let userProfile;

    // If upgrade is successful, fetch user to update the list of services.
    // Note that as long as the actual MHV upgrade responded with a success,
    // it will count as a success even if user fetch fails for whatever reason.
    try {
      mhvAccount = await apiRequest(`${baseUrl}/upgrade`, { method: 'POST' });
      userProfile = await apiRequest('/user');
    } catch (error) {
      if (!mhvAccount) return dispatch({ type: UPGRADE_MHV_ACCOUNT_FAILURE });
    }

    recordEvent({ event: 'register-mhv-upgrade-success' });
    return dispatch({
      type: UPGRADE_MHV_ACCOUNT_SUCCESS,
      mhvAccount,
      userProfile,
    });
  };
}

export function createAndUpgradeMHVAccount() {
  return async dispatch => {
    const accountCreationResult = await dispatch(createMHVAccount());

    const accountLevel = get(
      'data.attributes.accountLevel',
      accountCreationResult,
    );

    if (accountLevel) return dispatch(upgradeMHVAccount());

    return null;
  };
}
