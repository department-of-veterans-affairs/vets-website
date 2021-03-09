import { api } from '../config';

export const DISPLAY_MODAL = 'DISPLAY_MODAL';
export const ELIGIBILITY_CHANGED = 'ELIGIBILITY_CHANGED';
export const ENTER_PREVIEW_MODE = 'ENTER_PREVIEW_MODE';
export const EXIT_PREVIEW_MODE = 'EXIT_PREVIEW_MODE';
export const FETCH_CONSTANTS_FAILED = 'FETCH_CONSTANTS_FAILED';
export const FETCH_CONSTANTS_STARTED = 'FETCH_CONSTANTS_STARTED';
export const FETCH_CONSTANTS_SUCCEEDED = 'FETCH_CONSTANTS_SUCCEEDED';
export const FETCH_PROFILE_FAILED = 'FETCH_PROFILE_FAILED';
export const FETCH_PROFILE_STARTED = 'FETCH_PROFILE_STARTED';
export const FETCH_PROFILE_SUCCEEDED = 'FETCH_PROFILE_SUCCEEDED';
export const FILTER_TOGGLED = 'FILTER_TOGGLED';
export const INSTITUTION_FILTERS_CHANGED = 'INSTITUTION_FILTERS_CHANGED';
export const INSTITUTION_SEARCH_SUCCEEDED = 'INSTITUTION_SEARCH_SUCCEEDED';
export const PROGRAM_SEARCH_SUCCEEDED = 'PROGRAM_SEARCH_SUCCEEDED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SET_VERSION = 'SET_VERSION';
export const UPDATE_ROUTE = 'UPDATE_ROUTE';

export function enterPreviewMode(version) {
  return {
    type: ENTER_PREVIEW_MODE,
    version,
  };
}

export function exitPreviewMode() {
  return {
    type: EXIT_PREVIEW_MODE,
  };
}

export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title,
  };
}

export function showModal(modal) {
  return {
    type: DISPLAY_MODAL,
    modal,
  };
}

export function hideModal() {
  return showModal(null);
}

function withPreview(dispatch, action) {
  const version = action.payload.meta.version;
  if (version.preview) {
    dispatch({
      type: ENTER_PREVIEW_MODE,
      version,
    });
  } else if (version.createdAt) {
    dispatch({
      type: SET_VERSION,
      version,
    });
  }

  dispatch(action);
}

export function fetchProfile(facilityCode, version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/institutions/${facilityCode}${queryString}`;

  return (dispatch, getState) => {
    dispatch({ type: FETCH_PROFILE_STARTED });

    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(institution => {
        const { AVGVABAH, AVGDODBAH } = getState().constants.constants;
        return withPreview(dispatch, {
          type: FETCH_PROFILE_SUCCEEDED,
          payload: {
            ...institution,
            AVGVABAH,
            AVGDODBAH,
          },
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_PROFILE_FAILED,
          payload: err.message,
        });
      });
  };
}

export function fetchConstants(version) {
  const queryString = version ? `?version=${version}` : '';
  const url = `${api.url}/calculator_constants${queryString}`;
  return dispatch => {
    dispatch({ type: FETCH_CONSTANTS_STARTED });
    return fetch(url, api.settings)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(payload => {
        withPreview(dispatch, { type: FETCH_CONSTANTS_SUCCEEDED, payload });
      })
      .catch(err => {
        dispatch({
          type: FETCH_CONSTANTS_FAILED,
          payload: err.message,
        });
      });
  };
}

export function eligibilityChange(eligibility) {
  return { type: ELIGIBILITY_CHANGED, payload: eligibility };
}

export function institutionFilterChange(filters) {
  return { type: INSTITUTION_FILTERS_CHANGED, payload: filters };
}

export function updateEligibilityAndFilters(eligibility, filters) {
  return dispatch => {
    dispatch({ type: ELIGIBILITY_CHANGED, payload: eligibility });
    dispatch({ type: INSTITUTION_FILTERS_CHANGED, payload: filters });
  };
}
