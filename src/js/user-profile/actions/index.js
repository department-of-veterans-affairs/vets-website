/* eslint-disable */

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
      () => dispatch({ type: ACCEPTING_LATEST_MHV_TERMS_FAILURE })
    );
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch(removingSavedForm());
    return removeFormApi(formId)
      .then(() => {
        dispatch(removingSavedFormSuccess());
        getUserData(dispatch);
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}

const profileMocked = {
  extended: true,
  // email: profile.email,
  // userFullName: profile.userFullName,
  ssn: '123121232',
  dob: new Date().toISOString(),
  // gender: 'Male',
  telephones: [
    {
      type: 'primary',
      value: '1231231232'
    },
    {
      type: 'alternate',
      value: '2342342343'
    }
  ],
  addresses: [
    {
      type: 'residential',
      addressOne: '1432 Bayfield Ct',
      addressTwo: null,
      addressThree: null,
      city: 'Florence',
      stateCode: 'KY',
      zipCode: '41042',
      countryName: 'USA'
    },
    {
      type: 'mailing',
      addressOne: '1432 Bayfield Mailing Ct',
      addressTwo: null,
      addressThree: null,
      city: 'Florence',
      stateCode: 'KY',
      zipCode: '41042',
      countryName: 'USA'
    }
  ],
  toursOfDuty: [
    {
      serviceBranch: 'Navy',
      rank: 'First Lieutenant',
      dateRange: {
        start: new Date(new Date().valueOf() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
        end: new Date().toISOString()
      }
    },
    {
      serviceBranch: 'Army',
      rank: 'Second Lieutenant',
      dateRange: {
        start: new Date(new Date().valueOf() - (25 * 24 * 60 * 60 * 1000)).toISOString(),
        end: new Date(new Date().valueOf() - (10 * 24 * 60 * 60 * 1000)).toISOString()
      }
    }
  ]
};

function formExtendedProfile(profile, address, formPrefill) {
  console.log(address);
  console.log(formPrefill);
  return { ...profileMocked, ...profile };
}

export function fetchExtendedProfile() {
  return (dispatch, getState) => {

    const { user: { profile } } = getState();
    const requests = [
      apiRequest('/address'),
      apiRequest('/in_progress_forms/1010ez')
    ];

    Promise.all(requests)
      .then(data => formExtendedProfile(profile, ...data))
      .then(extendedProfile => {
        dispatch({ type: UPDATE_PROFILE_FIELDS, newState: extendedProfile });
      });
  };
}
