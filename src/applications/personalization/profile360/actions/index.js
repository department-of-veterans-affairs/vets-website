import { apiRequest } from '../../../../platform/utilities/api';
import Profile360Manifest from '../manifest.json';

export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_SUCCESS = 'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS = 'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_ADDRESS_CONSTANTS_SUCCESS = 'FETCH_ADDRESS_CONSTANTS_SUCCESS';

async function getData(apiRoute) {
  try {
    const response = await apiRequest(apiRoute);
    return response.data.attributes;
  } catch (error) {
    return { error };
  }
}

export function fetchHero() {
  return async (dispatch) => {
    dispatch({
      type: FETCH_HERO_SUCCESS,
      hero: {
        userFullName: await getData(`${Profile360Manifest.rootUrl}/full_name`)
      }
    });
  };
}

export function fetchPersonalInformation() {
  return async (dispatch) => {
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: await getData(`${Profile360Manifest.rootUrl}/personal_information`)
    });
  };
}

export function fetchMilitaryInformation() {
  return async (dispatch) => {
    dispatch({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation: {
        serviceHistory: await getData(`${Profile360Manifest.rootUrl}/service_history`)
      }
    });
  };
}
