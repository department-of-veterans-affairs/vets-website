import { getData } from '../util';
import environment from 'platform/utilities/environment';

export const FETCH_HERO = 'FETCH_HERO';
export const FETCH_HERO_SUCCESS = 'FETCH_HERO_SUCCESS';
export const FETCH_HERO_FAILED = 'FETCH_HERO_FAILED';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_MILITARY_INFORMATION_SUCCESS =
  'FETCH_MILITARY_INFORMATION_SUCCESS';
export const FETCH_ADDRESS_CONSTANTS_SUCCESS =
  'FETCH_ADDRESS_CONSTANTS_SUCCESS';

export function fetchHero() {
  return async dispatch => {
    dispatch({ type: FETCH_HERO });

    await getData('/profile/full_name')
      .then(data => {
        dispatch({ type: FETCH_HERO_SUCCESS, hero: { userFullName: data } });
      })
      .catch(errors => {
        dispatch({ type: FETCH_HERO_FAILED, hero: { errors } });
      });
  };
}

export function fetchPersonalInformation() {
  return async dispatch => {
    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: await getData('/profile/personal_information'),
    });
  };
}

export function fetchMilitaryInformation() {
  return async dispatch => {
    dispatch({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation: {
        serviceHistory: await getData('/profile/service_history'),
      },
    });
  };
}
