import { apiRequest } from '../../../../platform/utilities/api';

export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_SUCCESS = 'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS = 'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_ADDRESS_CONSTANTS_SUCCESS = 'FETCH_ADDRESS_CONSTANTS_SUCCESS';

export function fetchHero() {
  return async (dispatch) => {
    const userFullName = await apiRequest('/profile/full_name');
    dispatch({
      type: FETCH_HERO_SUCCESS,
      hero: {
        userFullName: userFullName.data.attributes
      }
    });
  };
}

export function fetchPersonalInformation() {
  return async (dispatch) => {
    const personalInformation = await apiRequest('/profile/personal_information');
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: personalInformation.data.attributes
    });
  };
}

export function fetchMilitaryInformation() {
  return async (dispatch) => {
    const serviceHistory = await apiRequest('/profile/service_history');
    dispatch({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation: {
        serviceHistory: serviceHistory.data.attributes
      }
    });
  };
}
