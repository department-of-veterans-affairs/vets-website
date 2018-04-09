import { removeFormApi } from '../../common/schemaform/save-in-progress/api';
import { apiRequest } from '../../common/helpers/api';
import { getUserData } from '../../common/helpers/login-helpers';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const FETCHING_LATEST_MHV_TERMS = 'FETCHING_LATEST_MHV_TERMS';
export const FETCHING_LATEST_MHV_TERMS_SUCCESS = 'FETCHING_LATEST_MHV_TERMS_SUCCESS';
export const FETCHING_LATEST_MHV_TERMS_FAILURE = 'FETCHING_LATEST_MHV_TERMS_FAILURE';
export const ACCEPTING_LATEST_MHV_TERMS = 'ACCEPTING_LATEST_MHV_TERMS';
export const ACCEPTING_LATEST_MHV_TERMS_SUCCESS = 'ACCEPTING_LATEST_MHV_TERMS_SUCCESS';
export const ACCEPTING_LATEST_MHV_TERMS_FAILURE = 'ACCEPTING_LATEST_MHV_TERMS_FAILURE';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';

export * from './mhv';

export function updateProfileFields(newState) {
  return {
    type: UPDATE_PROFILE_FIELDS,
    newState
  };
}

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED
  };
}

export function fetchLatestTerms(termsName) {
  return dispatch => {
    dispatch({ type: FETCHING_LATEST_MHV_TERMS });

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest`,
      null,
      ({ data }) => dispatch({
        type: FETCHING_LATEST_MHV_TERMS_SUCCESS,
        terms: data.attributes
      }),
      ({ errors }) => dispatch({ type: FETCHING_LATEST_MHV_TERMS_FAILURE, errors })
    );
  };
}

export function acceptTerms(termsName) {
  return dispatch => {
    dispatch({ type: ACCEPTING_LATEST_MHV_TERMS });
    window.dataLayer.push({ event: 'terms-accepted' });

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
      () => {
        dispatch({ type: ACCEPTING_LATEST_MHV_TERMS_SUCCESS });
        getUserData(dispatch);
      },
      ({ errors }) => dispatch({ type: ACCEPTING_LATEST_MHV_TERMS_FAILURE, errors })
    );
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch({ type: REMOVING_SAVED_FORM });
    return removeFormApi(formId)
      .then(() => {
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
        getUserData(dispatch);
      })
      .catch(() => dispatch({ type: REMOVING_SAVED_FORM_FAILURE }));
  };
}
