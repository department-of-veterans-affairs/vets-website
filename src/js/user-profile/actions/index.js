import { apiRequest } from '../../common/helpers/api';

export const UPDATE_PROFILE_FIELD = 'UPDATE_PROFILE_FIELD';
export const FETCHING_MHV_TERMS_ACCEPTANCE = 'FETCHING_MHV_TERMS_ACCEPTANCE';
export const FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS = 'FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS';
export const FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE = 'FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE';
export const FETCHING_LATEST_MHV_TERMS = 'FETCHING_LATEST_MHV_TERMS';
export const FETCHING_LATEST_MHV_TERMS_SUCCESS = 'FETCHING_LATEST_MHV_TERMS_SUCCESS';
export const FETCHING_LATEST_MHV_TERMS_FAILURE = 'FETCHING_LATEST_MHV_TERMS_FAILURE';
export const ACCEPTING_LATEST_MHV_TERMS = 'ACCEPTING_LATEST_MHV_TERMS';
export const ACCEPTING_LATEST_MHV_TERMS_SUCCESS = 'ACCEPTING_LATEST_MHV_TERMS_SUCCESS';
export const ACCEPTING_LATEST_MHV_TERMS_FAILURE = 'ACCEPTING_LATEST_MHV_TERMS_FAILURE';


export function updateProfileField(propertyPath, value) {
  return {
    type: UPDATE_PROFILE_FIELD,
    propertyPath,
    value
  };
}

export function checkAcceptance(termsName) {
  return dispatch => {
    dispatch({ type: FETCHING_MHV_TERMS_ACCEPTANCE });

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest/user_data`,
      null,
      response => dispatch({
        type: FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS,
        acceptance: response.data.attributes.createdAt
      }),
      () => dispatch({ type: FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE })
    );
  };
}

export function fetchLatestTerms(termsName) {
  return dispatch => {
    dispatch({ type: FETCHING_LATEST_MHV_TERMS });

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest`,
      null,
      response => dispatch({
        type: FETCHING_LATEST_MHV_TERMS_SUCCESS,
        terms: response.data.attributes
      }),
      () => dispatch({ type: FETCHING_LATEST_MHV_TERMS_FAILURE })
    );
  };
}

export function acceptTerms(termsName) {
  return dispatch => {
    dispatch({ type: ACCEPTING_LATEST_MHV_TERMS });

    const settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: termsName,
      })
    };

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest/user_data`,
      settings,
      () => dispatch({
        type: ACCEPTING_LATEST_MHV_TERMS_SUCCESS,
      }),
      () => dispatch({ type: ACCEPTING_LATEST_MHV_TERMS_FAILURE })
    );
  };
}
