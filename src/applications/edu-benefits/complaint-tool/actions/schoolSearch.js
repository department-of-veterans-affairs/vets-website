import {
  fetchInstitutions
} from '../helpers';

export const INSTITUTION_SELECTED = 'INSTITUTION_SELECTED';
export const LOAD_SCHOOLS_STARTED = 'LOAD_SCHOOLS_STARTED';
export const LOAD_SCHOOLS_SUCCEEDED = 'LOAD_SCHOOLS_SUCCEEDED';
export const LOAD_SCHOOLS_FAILED = 'LOAD_SCHOOLS_FAILED';
export const MANUAL_SCHOOL_ENTRY_TOGGLED = 'MANUAL_SCHOOL_ENTRY_TOGGLED';
export const SEARCH_CLEARED = 'SEARCH_CLEARED';
export const SEARCH_INPUT_CHANGED = 'SEARCH_INPUT_CHANGED';

export function clearSearch() {
  return {
    type: SEARCH_CLEARED
  };
}

export function searchInputChange({ searchInputValue }) {
  return {
    type: SEARCH_INPUT_CHANGED,
    searchInputValue
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
          error,
          institutionQuery
        });
      }
    });
  };
}

export function selectInstitution({ city, facilityCode, name, state }) {
  return {
    type: INSTITUTION_SELECTED,
    city,
    facilityCode,
    name,
    state
  };
}

export function toggleManualSchoolEntry(manualSchoolEntryChecked) {
  return {
    type: MANUAL_SCHOOL_ENTRY_TOGGLED,
    manualSchoolEntryChecked
  };
}
