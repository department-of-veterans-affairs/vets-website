import {
  fetchInstitutions
} from '../helpers';

export const LOAD_SCHOOLS_STARTED = 'LOAD_SCHOOLS_STARTED';
export const LOAD_SCHOOLS_SUCCEEDED = 'LOAD_SCHOOLS_SUCCEEDED';
export const LOAD_SCHOOLS_FAILED = 'LOAD_SCHOOLS_FAILED';
export const SEARCH_INPUT_CHANGE = 'SEARCH_INPUT_CHANGE';
export const SELECT_INSTITUTION = 'SELECT_INSTITUTION';

export function searchInputChange({ searchInputValue }) {
  return {
    type: SEARCH_INPUT_CHANGE,
    searchInputValue
  };
}

export function selectInstitution({ city, facilityCode, name, state }) {
  return {
    type: SELECT_INSTITUTION,
    city,
    facilityCode,
    name,
    state
  };
}

export function searchSchools({ institutionQuery, page }) {
  return dispatch => {
    dispatch({
      type: LOAD_SCHOOLS_STARTED,
      institutionQuery,
      page
    });

    fetchInstitutions({ institutionQuery, page }).then(({ error, payload }) => {
      if (payload) {
        dispatch({
          type: LOAD_SCHOOLS_SUCCEEDED,
          institutionQuery,
          payload
        });
      }
      if (error) {
        dispatch({
          type: LOAD_SCHOOLS_FAILED,
          error
        });
      }
    });
  };
}
