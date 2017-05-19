import { apiRequest } from '../../common/helpers/api';

export const UPDATE_PROFILE_FIELD = 'UPDATE_PROFILE_FIELD';
export const FETCHING_MHV_TERMS_ACCEPTANCE = 'FETCHING_MHV_TERMS_ACCEPTANCE';
export const FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS = 'FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS';
export const FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE = 'FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE';
export const FETCHING_LATEST_MHV_TERMS = 'FETCHING_LATEST_MHV_TERMS';
export const FETCHING_LATEST_MHV_TERMS_SUCCESS = 'FETCHING_LATEST_MHV_TERMS_SUCCESS';
export const FETCHING_LATEST_MHV_TERMS_FAILURE = 'FETCHING_LATEST_MHV_TERMS_FAILURE';

export function updateProfileField(propertyPath, value) {
  return {
    type: UPDATE_PROFILE_FIELD,
    propertyPath,
    value
  };
}

export function checkAcceptance() {
  return dispatch => {
    dispatch({ type: FETCHING_MHV_TERMS_ACCEPTANCE });

    apiRequest(
      '/terms_and_conditions/mhvac/versions/latest/user_data',
      null,
      response => dispatch({
        type: FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS,
        acceptance: response.data.attributes.created_at
      }),
      () => dispatch({ type: FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE })
    );
  };
}

export function fetchLatestTerms() {
  return dispatch => {
    dispatch({ type: FETCHING_LATEST_MHV_TERMS });

    apiRequest(
      '/terms_and_conditions/mhvac/versions/latest',
      null,
      response => dispatch({
        type: FETCHING_LATEST_MHV_TERMS_SUCCESS,
        terms: response.data.attributes
      }),
      () => dispatch({ type: FETCHING_LATEST_MHV_TERMS_FAILURE })
    );
  };
}
