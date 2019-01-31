import recordEvent from '../../../../platform/monitoring/record-event';

import { fetchInstitutions, trackingPrefix } from '../helpers';

export const INSTITUTION_SELECTED = 'INSTITUTION_SELECTED';
export const LOAD_SCHOOLS_STARTED = 'LOAD_SCHOOLS_STARTED';
export const LOAD_SCHOOLS_SUCCEEDED = 'LOAD_SCHOOLS_SUCCEEDED';
export const LOAD_SCHOOLS_FAILED = 'LOAD_SCHOOLS_FAILED';
export const MANUAL_SCHOOL_ENTRY_TOGGLED = 'MANUAL_SCHOOL_ENTRY_TOGGLED';
export const RESTORE_FROM_PREFILL_STARTED = 'RESTORE_FROM_PREFILL_STARTED';
export const RESTORE_FROM_PREFILL_SUCCEEDED = 'RESTORE_FROM_PREFILL_SUCCEEDED';
export const RESTORE_FROM_PREFILL_FAILED = 'RESTORE_FROM_PREFILL_FAILED';
export const SEARCH_CLEARED = 'SEARCH_CLEARED';
export const SEARCH_INPUT_CHANGED = 'SEARCH_INPUT_CHANGED';

export function clearSearch() {
  return {
    type: SEARCH_CLEARED,
  };
}

export function restoreFromPrefill({
  institutionQuery,
  institutionSelected,
  page,
  searchInputValue,
}) {
  return dispatch => {
    dispatch({
      type: RESTORE_FROM_PREFILL_STARTED,
      institutionQuery,
      institutionSelected,
      page,
      searchInputValue,
    });

    fetchInstitutions({
      institutionQuery,
      page,
      onDone: payload => {
        dispatch({
          type: RESTORE_FROM_PREFILL_SUCCEEDED,
          institutionQuery,
          payload,
        });
      },
      onError: error => {
        dispatch({
          type: RESTORE_FROM_PREFILL_FAILED,
          error,
          institutionQuery,
        });
      },
    });
  };
}

export function searchInputChange({ searchInputValue }) {
  return {
    type: SEARCH_INPUT_CHANGED,
    searchInputValue,
  };
}

export function searchSchools({ institutionQuery, page }) {
  return dispatch => {
    dispatch({
      type: LOAD_SCHOOLS_STARTED,
      institutionQuery,
      page,
    });

    fetchInstitutions({
      institutionQuery,
      page,
      onDone: payload => {
        dispatch({
          type: LOAD_SCHOOLS_SUCCEEDED,
          institutionQuery,
          payload,
        });
      },
      onError: error => {
        recordEvent({ event: `${trackingPrefix}school-not-found` });
        dispatch({
          type: LOAD_SCHOOLS_FAILED,
          error,
          institutionQuery,
        });
      },
    });
  };
}

export function selectInstitution({
  address1,
  address2,
  address3,
  city,
  facilityCode,
  name,
  state,
}) {
  return {
    type: INSTITUTION_SELECTED,
    address1,
    address2,
    address3,
    city,
    facilityCode,
    name,
    state,
  };
}

export function toggleManualSchoolEntry(manualSchoolEntryChecked) {
  return {
    type: MANUAL_SCHOOL_ENTRY_TOGGLED,
    manualSchoolEntryChecked,
  };
}
