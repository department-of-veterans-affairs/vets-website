import { getData } from '../util';

export const FETCH_HERO = 'FETCH_HERO';
export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_HERO_FAILED = 'FETCH_HERO_FAILED';

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';

export const FETCH_MILITARY_INFORMATION = 'FETCH_MILITARY_INFORMATION';
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_FAILED =
  'FETCH_MILITARY_INFORMATION_FAILED';

export const FETCH_ADDRESS_CONSTANTS_SUCCESS =
  'FETCH_ADDRESS_CONSTANTS_SUCCESS';

export function fetchHero() {
  return async dispatch => {
    dispatch({ type: FETCH_HERO });
    const response = await getData('/profile/full_name');

    if (response.errors || response.error) {
      dispatch({ type: FETCH_HERO_FAILED, hero: { errors: response } });
      return;
    }

    dispatch({ type: FETCH_HERO_SUCCESS, hero: { userFullName: response } });
  };
}

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });
    const response = await getData('/profile/personal_information');

    if (response.errors || response.error) {
      dispatch({
        type: FETCH_PERSONAL_INFORMATION_FAILED,
        personalInformation: { errors: response },
      });
      return;
    }
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: response,
    });
  };
}

export function fetchMilitaryInformation() {
  return async dispatch => {
    dispatch({ type: FETCH_MILITARY_INFORMATION });
    const response = await getData('/profile/service_history');

    if (response.errors || response.error) {
      const error = response.error || response.errors;
      dispatch({
        type: FETCH_MILITARY_INFORMATION_FAILED,
        militaryInformation: {
          serviceHistory: {
            error,
          },
        },
      });
      return;
    }

    dispatch({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation: {
        serviceHistory: response,
      },
    });
  };
}
