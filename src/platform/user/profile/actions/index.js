import recordEvent from '../../../monitoring/record-event';
import { removeFormApi } from '../../../../js/common/schemaform/save-in-progress/api';
import { apiRequest } from '../../../utilities/api';
import { updateLoggedInStatus } from '../../../site-wide/user-nav/actions';
import environment from '../../../utilities/environment';

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

export function getUserData(dispatch) {
  fetch(`${environment.API_URL}/v0/user`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Token token=${sessionStorage.userToken}`
    })
  }).then(response => {
    if (response.ok) return response.json();
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }).then(json => {
    const userData = json.data.attributes.profile;
    // sessionStorage coerces everything into String. this if-statement
    // is to prevent the firstname being set to the string 'Null'
    if (userData.first_name) {
      sessionStorage.setItem('userFirstName', userData.first_name);
    }
    // Report out the current level of assurance for the user
    recordEvent({ event: `login-loa-current-${userData.loa.current}` });
    dispatch(updateProfileFields({
      savedForms: json.data.attributes.in_progress_forms,
      prefillsAvailable: json.data.attributes.prefills_available,
      accountType: userData.loa.current,
      email: userData.email,
      userFullName: {
        first: userData.first_name,
        middle: userData.middle_name,
        last: userData.last_name,
      },
      authnContext: userData.authn_context,
      loa: userData.loa,
      multifactor: userData.multifactor,
      verified: userData.verified,
      gender: userData.gender,
      dob: userData.birth_date,
      status: json.data.attributes.va_profile.status,
      veteranStatus: json.data.attributes.veteran_status.status,
      isVeteran: json.data.attributes.veteran_status.is_veteran,
      services: json.data.attributes.services,
      mhv: {
        account: { state: json.data.attributes.mhv_account_state },
        terms: { accepted: json.data.attributes.health_terms_current }
      }
    }));
    dispatch(updateLoggedInStatus(true));
  }).catch(error => {
    if (error.status === 401) {
      for (const key of ['entryTime', 'userToken', 'userFirstName']) {
        sessionStorage.removeItem(key);
      }
    }
    dispatch(profileLoadingFinished());
  });
}

export function removingSavedForm() {
  return {
    type: REMOVING_SAVED_FORM
  };
}

export function removingSavedFormSuccess() {
  return {
    type: REMOVING_SAVED_FORM_SUCCESS
  };
}

export function removingSavedFormFailure() {
  return {
    type: REMOVING_SAVED_FORM_FAILURE
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
    recordEvent({ event: 'terms-accepted' });

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
      () => dispatch({ type: ACCEPTING_LATEST_MHV_TERMS_FAILURE })
    );
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch(removingSavedForm());
    return removeFormApi(formId)
      .then(() => {
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
        getUserData(dispatch);
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}
