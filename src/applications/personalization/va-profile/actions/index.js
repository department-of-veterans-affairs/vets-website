import { apiRequest } from '../../../../platform/utilities/api';
import sendAndMergeApiRequests from '../util/sendAndMergeApiRequests';

export const VA_PROFILE_READY = 'VA_PROFILE_READY';

export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_CONTACT_INFORMATION_SUCCESS = 'FETCH_CONTACT_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_SUCCESS = 'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS = 'FETCH_MILITARY_INFORMATION_SUCCESS';

export const FETCH_ADDRESS_STATES = 'FETCH_ADDRESS_STATES';
export const FETCH_ADDRESS_STATES_SUCCESS = 'FETCH_ADDRESS_STATES_SUCCESS';
export const FETCH_ADDRESS_STATES_FAIL = 'FETCH_ADDRESS_STATES_FAIL';

export const FETCH_ADDRESS_COUNTRIES = 'FETCH_ADDRESS_COUNTRIES';
export const FETCH_ADDRESS_COUNTRIES_SUCCESS = 'FETCH_ADDRESS_COUNTRIES_SUCCESS';
export const FETCH_ADDRESS_COUNTRIES_FAIL = 'FETCH_ADDRESS_COUNTRIES_FAIL';

export * from './updaters';
export * from './misc';

function fetchHero() {
  return async (dispatch) => {
    const hero = await sendAndMergeApiRequests({
      userFullName: '/profile/full_name'
    });
    dispatch({
      type: FETCH_HERO_SUCCESS,
      hero
    });
  };
}

function fetchContactInformation() {
  return async (dispatch) => {
    const contactInformation = await sendAndMergeApiRequests({
      email: '/profile/email',
      primaryTelephone: '/profile/primary_phone',
      alternateTelephone: '/profile/alternate_phone',
      mailingAddress: '/profile/mailing_address'
    });
    dispatch({
      type: FETCH_CONTACT_INFORMATION_SUCCESS,
      contactInformation
    });
  };
}

function fetchPersonalInformation() {
  return async (dispatch) => {
    const response = await apiRequest('/profile/personal_information');
    const personalInformation = response.data.attributes;
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation
    });
  };
}

function fetchMilitaryInformation() {
  return async (dispatch) => {
    const militaryInformation = await sendAndMergeApiRequests({
      serviceHistory: '/profile/service_history'
    });
    dispatch({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation
    });
  };
}

function fetchAddressCountries() {
  return async (dispatch) => {
    const response = await apiRequest('/address/countries');
    dispatch({
      type: FETCH_ADDRESS_COUNTRIES_SUCCESS,
      countries: response.data.attributes.countries
    });
  };
}

function fetchAddressStates() {
  return async (dispatch) => {
    const response = await apiRequest('/address/states');
    dispatch({
      type: FETCH_ADDRESS_STATES_SUCCESS,
      states: response.data.attributes.states
    });
  };
}

export function startup() {
  return async (dispatch) => {
    try {
      await Promise.all([
        dispatch(fetchAddressCountries()),
        dispatch(fetchAddressStates())
      ]);
    } catch (err) {
      // There are error handlers throughout the app
    }
    dispatch({ type: VA_PROFILE_READY });
    dispatch(fetchHero());
    dispatch(fetchContactInformation());
    dispatch(fetchPersonalInformation());
    dispatch(fetchMilitaryInformation());
  };
}
