import { apiRequest } from '../../../../platform/utilities/api';
import localVet360, { isVet360Configured } from '../util/local-vet360';
import sendAndMergeApiRequests from '../util/sendAndMergeApiRequests';
import _ from 'lodash';
import countries from '../constants/countries.json';
import states from '../constants/states.json';

export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_SUCCESS = 'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS = 'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_ADDRESS_CONSTANTS_SUCCESS = 'FETCH_ADDRESS_CONSTANTS_SUCCESS';

export const VET360_TRANSACTIONS_FETCH_SUCCESS = 'VET360_TRANSACTIONS_FETCH_SUCCESS';

export * from './updaters';
export * from './misc';

export function fetchHero() {
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

export function fetchPersonalInformation() {
  return async (dispatch) => {
    const result = await sendAndMergeApiRequests({
      personalInformation: '/profile/personal_information'
    });
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: result.personalInformation
    });
  };
}

export function fetchMilitaryInformation() {
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

export function fetchAddressConstants() {
  return ({
    type: FETCH_ADDRESS_CONSTANTS_SUCCESS,
    addressConstants: {
      states: _.map(states, 'stateCode'),
      countries: _.map(countries, 'countryName'),
    }
  });
}

export function fetchTransactions() {
  return async (dispatch) => {
    try {
      const response = isVet360Configured() ? await apiRequest('/profile/status/') : localVet360.getUserTransactions();
      dispatch({
        type: VET360_TRANSACTIONS_FETCH_SUCCESS,
        data: response.data
      });
    } catch (err) {
      // If we sync transactions in the background and fail, is it worth telling the user?
    }
  };
}

export function startup() {
  return async (dispatch) => {
    dispatch(fetchHero());
    dispatch(fetchAddressConstants());
    dispatch(fetchPersonalInformation());
    dispatch(fetchMilitaryInformation());
  };
}
