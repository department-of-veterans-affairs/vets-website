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

export const OPEN_MODAL = 'OPEN_MODAL';

export const FETCH_EXTENDED_PROFILE = 'FETCH_EXTENDED_PROFILE';
export const FETCH_EXTENDED_PROFILE_FAIL = 'FETCH_EXTENDED_PROFILE_FAIL';
export const FETCH_EXTENDED_PROFILE_SUCCESS = 'FETCH_EXTENDED_PROFILE_SUCCESS';

export const SAVE_MAILING_ADDRESS = 'SAVE_MAILING_ADDRESS';
export const SAVE_MAILING_ADDRESS_FAIL = 'SAVE_MAILING_ADDRESS_FAIL';
export const SAVE_MAILING_ADDRESS_SUCCESS = 'SAVE_MAILING_ADDRESS_SUCCESS';

export const SAVE_RESIDENTIAL_ADDRESS = 'SAVE_RESIDENTIAL_ADDRESS';
export const SAVE_RESIDENTIAL_ADDRESS_FAIL = 'SAVE_RESIDENTIAL_ADDRESS_FAIL';
export const SAVE_RESIDENTIAL_ADDRESS_SUCCESS = 'SAVE_RESIDENTIAL_ADDRESS_SUCCESS';

export const SAVE_PRIMARY_PHONE = 'SAVE_PRIMARY_PHONE';
export const SAVE_PRIMARY_PHONE_FAIL = 'SAVE_PRIMARY_PHONE_FAIL';
export const SAVE_PRIMARY_PHONE_SUCCESS = 'SAVE_PRIMARY_PHONE_SUCCESS';

export const SAVE_ALTERNATE_PHONE = 'SAVE_ALTERNATE_PHONE';
export const SAVE_ALTERNATE_PHONE_FAIL = 'SAVE_ALTERNATE_PHONE_FAIL';
export const SAVE_ALTERNATE_PHONE_SUCCESS = 'SAVE_ALTERNATE_PHONE_SUCCESS';

export const SAVE_EMAIL_ADDRESS = 'SAVE_EMAIL_ADDRESS';
export const SAVE_EMAIL_ADDRESS_FAIL = 'SAVE_EMAIL_ADDRESS_FAIL';
export const SAVE_EMAIL_ADDRESS_SUCCESS = 'SAVE_EMAIL_ADDRESS_SUCCESS';

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

// @todo once the endpoints are built we can actually send an API request.
function saveFieldHandler(apiRoute, requestStartAction, requestSuccessAction) {
  return fieldValue => {
    return dispatch => {
      dispatch({ type: requestStartAction });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(dispatch({ type: requestSuccessAction, newValue: fieldValue }));
        }, 2000);
      });
    };
  };
}

export const updateEmailAddress = saveFieldHandler('/v0/email', SAVE_EMAIL_ADDRESS, SAVE_EMAIL_ADDRESS_SUCCESS, SAVE_EMAIL_ADDRESS_FAIL);
export const updatePrimaryPhone = saveFieldHandler('/v0/phone/primary', SAVE_PRIMARY_PHONE, SAVE_PRIMARY_PHONE_SUCCESS, SAVE_PRIMARY_PHONE_FAIL);
export const updateAlternatePhone = saveFieldHandler('/v0/phone/alternate', SAVE_ALTERNATE_PHONE, SAVE_ALTERNATE_PHONE_SUCCESS, SAVE_ALTERNATE_PHONE_FAIL);
export const updateMailingAddress = saveFieldHandler('/v0/address/mailing', SAVE_MAILING_ADDRESS, SAVE_MAILING_ADDRESS_SUCCESS, SAVE_MAILING_ADDRESS_FAIL);
export const updateResidentialAddress = saveFieldHandler('/v0/address/residential', SAVE_RESIDENTIAL_ADDRESS, SAVE_RESIDENTIAL_ADDRESS_SUCCESS, SAVE_RESIDENTIAL_ADDRESS_FAIL);

function getEmailAddress() {
// https://github.com/department-of-veterans-affairs/vets-api/pull/1718
  return apiRequest('/profile/email')
    .then(response => response.json())
    .then(json => json.data.attributes.email)
    .catch(() => {
      // eslint-disable-no-console
      // console.log(err);
      return null;
    });
}

// The result of this function will become the arguments to formExtendedProfile (but with profile as the first arg)
function sendProfileRequests() {
  return [
    getEmailAddress()
  ];
}

function getExtendedProfile(profile, email) {

  return {
    ...profile,

    // ?
    profilePicture: '/img/profile.png',
    userFullName: profile.userFullName,
    dob: profile.dob,
    gender: profile.gender,
    ssn: '123121232',

    // Vet360
    email: email || profile.email,
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
        addressOne: '1000 Strawberry Lane',
        addressTwo: null,
        addressThree: null,
        city: 'Miama',
        stateCode: 'FL',
        zipCode: '41229',
        countryName: 'USA'
      },
      {
        type: 'mailing',
        addressOne: '2000 Blueberry Drive',
        addressTwo: null,
        addressThree: null,
        city: 'Miami',
        stateCode: 'FL',
        zipCode: '41229',
        countryName: 'USA'
      }
    ],

    // EMIS
    toursOfDuty: [
      {
        serviceBranch: 'Navy',
        rank: 'First Lieutenant',
        dateRange: {
          start: '2018-02-17T20:31:57.286Z',
          end: '2018-02-18T20:31:57.286Z'
        }
      },
      {
        serviceBranch: 'Army',
        rank: 'Second Lieutenant',
        dateRange: {
          start: '2016-02-18T20:31:57.286Z',
          end: '2017-02-18T20:31:57.286Z'
        }
      }
    ],

    serviceAwards: [
      {
        name: 'Army Commendation Medal'
      }
    ]
  };
}

export function fetchExtendedProfile() {
  return (dispatch, getState) => {
    const { user: { profile } } = getState();
    const requests = sendProfileRequests();

    dispatch({ type: FETCH_EXTENDED_PROFILE });

    Promise.all(requests)
      .then(data => getExtendedProfile(profile, ...data))
      .then(extendedProfile => {
        dispatch({ type: FETCH_EXTENDED_PROFILE_SUCCESS, newState: extendedProfile });
      })
      .catch(() => dispatch({ type: FETCH_EXTENDED_PROFILE_FAIL }));
  };
}

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}
