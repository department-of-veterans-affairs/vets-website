import sendAndMergeApiRequests from '../util/sendAndMergeApiRequests';

export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_SUCCESS = 'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS = 'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_ADDRESS_CONSTANTS_SUCCESS = 'FETCH_ADDRESS_CONSTANTS_SUCCESS';

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
